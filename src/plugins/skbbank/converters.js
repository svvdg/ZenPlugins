import { getIntervalBetweenDates } from '../../common/momentDateUtils'
// import { fetchProducts } from './api'

export function convertAccounts (apiAccounts) {
  let accounts = convertAccountCard(apiAccounts)
  let account = convertLoan(apiAccounts)
  accounts = accounts.concat(account)
  account = convertDeposit(apiAccounts)
  accounts = accounts.concat(account)
  // const accounts = apiAccounts.map(parseConvertAccount).filter(x => !!x)
  // let accounts = apiAccounts.cards.map(convertCard).filter(x => !!x)
  // accounts = accounts.concat(apiAccounts.accounts.map(convertAccount).filter(x => !!x))
  // accounts = accounts.concat(apiAccounts.deposits.map(convertDeposit).filter(x => !!x))
  // accounts = accounts.concat(apiAccounts.loans.map(convertLoan).filter(x => !!x))
  // console.log(accounts)
  return accounts
}

function convertAccountCard (apiAccounts) {
  if (!apiAccounts.accounts) {
    return null
  }

  let accounts = []
  for (let i = 0; i < apiAccounts.accounts.length; i++) {
    const apiAccount = apiAccounts.accounts[i]
    if (apiAccount.category !== 'account') {
      return null
    }
    if (apiAccount.allowLoanRepayment === false) {
      continue
    }

    const account = {
      id: apiAccount.number,
      type: 'checking',
      title: apiAccount.name,
      balance: apiAccount.amount,
      instrument: apiAccount.currency,
      creditLimit: 0,
      syncIds: [apiAccount.number]
    }
    if (apiAccount.type === 'card') {
      account.type = 'ccard'
      account.storedId = apiAccount.cards
      for (let i = 0; i < apiAccounts.cards.length; i++) {
        if (account.storedId[i] === apiAccounts.cards[i].storedId) {
          account.syncIds.push(apiAccounts.cards[i].pan)
        }
      }
    }
    accounts = accounts.concat(account)
  }
  return accounts
}

function convertDeposit (apiAccounts) {
  if (!apiAccounts.deposits) {
    return null
  }

  let accounts = []
  for (let i = 0; i < apiAccounts.deposits.length; i++) {
    const apiDeposit = apiAccounts.deposits[i]
    if (!apiDeposit.contract_number) {
      return null
    }
    let payoffInterval = {}
    for (const pattern of [
      /В конце срока/i,
      /Ежеквартально/i
    ]) {
      const match = apiDeposit.percentPaidPeriod.match(pattern)
      if (match) {
        payoffInterval = null
      }
    }
    if (payoffInterval === undefined) {
      console.log('Unexpected percentPaidPeriod ' + apiDeposit.percentPaydPeriod)
      return null
    }
    let payoffStep = 1
    if (payoffInterval === null) {
      payoffStep = 0
    }
    const account = {
      id: apiDeposit.account,
      type: 'deposit',
      title: apiDeposit.name,
      instrument: apiDeposit.currency,
      balance: apiDeposit.balance,
      capitalization: apiDeposit.capitalization,
      percent: apiDeposit.rate,
      startDate: new Date(parseDate(apiDeposit.open_date)),
      startBalance: apiDeposit.opening_balance,
      endDateOffset: Number(apiDeposit.duration),
      endDateOffsetInterval: 'day',
      payoffInterval: payoffInterval,
      payoffStep: payoffStep,
      syncIds: [apiDeposit.account]
    }
    accounts = accounts.concat(account)
  }
  return accounts
}

function convertLoan (apiAccounts) {
  if (!apiAccounts.loans) {
    return null
  }

  let accounts = []
  for (let i = 0; i < apiAccounts.loans.length; i++) {
    const apiLoan = apiAccounts.loans[i]
    if (!apiLoan.mainAccount) {
      return null
    }

    const fromDate = new Date(parseDate(apiLoan.openDate))
    const toDate = new Date(parseDate(apiLoan.endDate))
    const { interval, count } = getIntervalBetweenDates(fromDate, toDate)
    const account = {
      id: apiLoan.repaymentAccount,
      mainAccount: apiLoan.mainAccount,
      type: 'loan',
      title: apiLoan.name,
      instrument: apiLoan.currency,
      balance: -apiLoan.amount,
      capitalization: apiLoan.capitalization || true,
      percent: apiLoan.interestRate,
      startDate: fromDate,
      endDateOffset: count,
      endDateOffsetInterval: interval,
      syncIds: [
        apiLoan.mainAccount,
        apiLoan.repaymentAccount
      ]
    }
    accounts = accounts.concat(account)
  }
  return accounts
}

export function findId (accounts) {
  let accountsById = {}
  for (let a = 0; a < accounts.length; a++) {
    let accountId = {}
    const account = accounts[a]
    for (let i = 0; i < account.syncIds.length; i++) {
      accountId[account.syncIds[i]] = {
        id: account.id
      }
    }
    if (account.storedId) {
      const accountStorId = {}
      for (let b = 0; b < account.storedId.length; b++) {
        accountStorId[account.storedId[b]] = {
          id: account.id
        }
      }
      accountId = Object.assign(accountId, accountStorId)
    }
    accountsById = Object.assign(accountsById, accountId)
  }
  return accountsById
}
/*
function findAccountByStoredId (accounts, storedId) {
  for (const acc of accounts) {
    if (acc.storedId === storedId) {
      return acc
    }
  }
  console.assert(false, 'cannot find storedId ' + storedId)
}

 */

export function convertTransaction (rawTransaction, accounts, accountsById) {
  if (rawTransaction.view.state === 'rejected' || rawTransaction.info.subType === 'loan-repayment') {
    return null
  }

  const invoice = {
    sum: rawTransaction.view.direction === 'debit' ? -rawTransaction.view.amounts.amount : rawTransaction.view.amounts.amount,
    instrument: rawTransaction.view.amounts.currency
  }

  /*
  // Для операции стягивания в productAccount будет null, в productCardId - идентификатор внешней карты.
  let accountId = rawTransaction.view.productAccount || rawTransaction.view.productCardId
  if (!accountId && rawTransaction.info.operationType === 'payment') {
    accountId = findAccountByStoredId(accounts, rawTransaction.details['payee-card']).id
  }
  */

  const transaction = {
    date: new Date(rawTransaction.view.dateCreated),
    hold: rawTransaction.view.state !== 'processed',
    merchant: {
      country: invoice.instrument === accounts.instrument ? null : rawTransaction.details.purpose.slice(-3),
      city: invoice.instrument === accounts.instrument ? null : rawTransaction.details.terminal.city,
      title: rawTransaction.view.descriptions.operationDescription || rawTransaction.view.mainRequisite,
      mcc: null,
      location: null
    },
    movements: [
      {
        id: rawTransaction.info.id.toString(),
        account: { id: accounts.id },
        invoice: invoice.instrument === accounts.instrument ? null : invoice,
        sum: invoice.instrument === accounts.instrument ? invoice.sum
          : rawTransaction.view.direction === 'debit' ? -rawTransaction.details.convAmount : rawTransaction.details.convAmount,
        fee: 0
      }
    ],
    comment: null
  }
  if (rawTransaction.view.mainRequisite) {
    const mcc = rawTransaction.view.mainRequisite.match('МСС: (\\d+)')
    if (mcc) {
      transaction.merchant.mcc = Number(mcc[1])
    }
  };
  [
    parseTransferAccountTransaction
    // parseTransferInnerTransaction
  ].some(parser => parser(rawTransaction, transaction, invoice))

  parseAccountIds(transaction, accountsById)

  return transaction
}

function parseTransferAccountTransaction (rawTransaction, transaction, invoice, accountIds) {
  for (const pattern of [
    /p2p/i,
    /sbp_in/i,
    /internal/i
    // /transfer_rub/i
  ]) {
    const match = rawTransaction.info.subType.match(pattern) || rawTransaction.view.direction.match(pattern)
    if (match) {
      transaction.comment = rawTransaction.view.comment || rawTransaction.view.mainRequisite
      transaction.movements.push(
        {
          id: null,
          account: {
            type: null,
            instrument: invoice.instrument,
            syncIds: [
              rawTransaction.view.productAccount
            ],
            company: null
          },
          invoice: null,
          sum: -invoice.sum,
          fee: 0
        })
      if (rawTransaction.info.subType === 'p2p') {
        const card = rawTransaction.view.mainRequisite.match('С карты \\*+(\\d{4})$')
        transaction.comment = rawTransaction.view.descriptions.operationDescription
        transaction.merchant.title = rawTransaction.view.mainRequisite
        transaction.movements[0].account.syncIds = [rawTransaction.details['payee-card'], rawTransaction.details['payee-card-mask-pan'].slice(-4)]
        transaction.movements[1].account.syncIds = [rawTransaction.details['payer-card'], card[1]]
      } else if (rawTransaction.info.subType === 'transfer-own' && rawTransaction.view.direction === 'internal') {
        transaction.comment = rawTransaction.details.comment || rawTransaction.view.mainRequisite
        // transaction.merchant.title = rawTransaction.view.mainRequisite ???????
        transaction.movements[0].account.syncIds = [rawTransaction.details.payeeAccount]
      } else if (rawTransaction.info.subType === 'transfer_rub' && rawTransaction.view.direction === 'internal') {
        transaction.comment = rawTransaction.view.descriptions.operationDescription || rawTransaction.view.mainRequisite
        transaction.merchant.title = rawTransaction.details['payee-name']
        transaction.movements[0].account.syncIds = [rawTransaction.details['payee-account']]
        transaction.movements[1].account.syncIds = [rawTransaction.details['payer-account']]
      }
      return true
    }
  }
  return false
}

function parseDate (stringDate) {
  const date = stringDate.match(/(\d{2}).(\d{2}).(\d{4})/)
  return new Date(date[3], date[2] - 1, date[1])
}

function parseAccountIds (transaction, accountIds) {
  if (transaction.movements[0].account.syncIds in accountIds === true &&
    transaction.movements[1].account.syncIds in accountIds === true) {
    // transaction.comment = 'internal' // ???? Что тут надо ???
    console.log('internal')
  } else if (transaction.movements[0].account.syncIds in accountIds === false ||
    transaction.movements[1].account.syncIds in accountIds === false) {
    // transaction.comment = 'internal' // ???? Что тут надо ???
    console.log('income || outcome')
  } else if (transaction.movements[0].account.syncIds in accountIds === false &&
  transaction.movements[1].account.syncIds in accountIds === false) {
    // transaction.comment = 'internal' // ???? Что тут надо ???
    console.log('Ошибка - нет своего счета') // ???? Что тут надо ???
  }
  // return transaction.comment
}
/*
function parseTransferTransaction (rawTransaction, transaction, invoice) {
  if (rawTransaction.view.direction === 'credit') {
    for (const pattern of [
      // /Отправка денежного/i,
      /Пополнения/i,
      /Переводы/i
    ]) {
      const match = rawTransaction.view.category.name.match(pattern)
      if (match) {
        transaction.comment = rawTransaction.view.comment
        transaction.movements.push(
          {
            id: null,
            account: {
              type: null,
              instrument: invoice.instrument,
              syncIds: [
                rawTransaction.view.productAccount
                // rawTransaction.view.mainRequisite.match(/\d{-4}/)
              ],
              company: null
            },
            invoice: null,
            sum: -invoice.sum,
            fee: 0
          }
        )
      }
      return true
    }
  }
  return false
}
 */

/*
function findAccountByStoredId (accounts, storedId) {
  for (const acc of accounts) {
    if (acc.storedId === storedId) {
      return acc
    }
  }
  console.assert(false, 'cannot find storedId ' + storedId)
}

/*
export function convertAccountTransaction (json, accounts) {
  const transaction = {
    id: json.info.id.toString(),
    date: json.view.dateCreated,
    hold: json.view.state !== 'processed'
  }
  // Для операции стягивания в productAccount будет null, в productCardId - идентификатор внешней карты.
  let accountId = json.view.productAccount
  if (!accountId && json.info.operationType === 'payment') {
    accountId = findAccountByStoredId(accounts, json.details['payee-card']).id
  }
  transaction.incomeAccount = transaction.outcomeAccount = accountId
  transaction.income = transaction.outcome = 0
  if (json.view.direction === 'debit') {
    transaction.outcome = json.view.amounts.amount
    transaction.payee = json.view.descriptions.operationDescription
    if (json.view.amounts.currency !== 'RUB' && json.info.operationType === 'card_transaction') {
      transaction.opOutcome = json.view.amounts.amount
      transaction.opOutcomeInstrument = json.view.amounts.currency
      transaction.outcome = json.details.convAmount
    }
  } else if (json.view.direction === 'credit') {
    transaction.income = json.view.amounts.amount
    transaction.comment = json.view.descriptions.operationDescription || json.view.mainRequisite
    if (json.view.amounts.currency !== 'RUB') {
      transaction.opIncome = json.view.amounts.amount
      transaction.opIncomeInstrument = json.view.amounts.currency
      transaction.income = json.details.convAmount
    }
  } else if (json.view.direction === 'internal') {
    transaction.income = json.view.amounts.amount
    transaction.outcome = json.view.amounts.amount
    transaction.comment = json.view.descriptions.operationDescription || json.view.mainRequisite
    if (json.info.operationType === 'account_transaction') {
      transaction.outcomeAccount = json.details.payeeAccount
    } else if (json.info.operationType === 'payment') {
      transaction.incomeAccount = json.details['payer-account']
      transaction.outcomeAccount = json.details['payee-account']
    }
  } else {
    console.assert(false, 'unexpected transaction direction ' + json.view.direction)
  }
  if (json.view.mainRequisite) {
    const mcc = json.view.mainRequisite.match('МСС: (\\d+)')
    if (mcc) {
      transaction.mcc = Number(mcc[1])
    }
  }
  return transaction
}
 */
