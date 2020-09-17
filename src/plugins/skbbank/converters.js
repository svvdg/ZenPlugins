import { getIntervalBetweenDates } from '../../common/momentDateUtils'
// import { accountId } from './index'

export function convertAccount (rawTransaction) {
  if (rawTransaction.type !== 'current' && rawTransaction.category !== 'account') {
    return null
  }
  const account = {
    id: rawTransaction.number,
    type: 'checking',
    title: rawTransaction.name, // 'Счет RUB'
    balance: rawTransaction.balance,
    instrument: rawTransaction.currency,
    creditLimit: 0,
    syncIds: [rawTransaction.number] // .slice(-4) обрезать нужно???
  }
  if (rawTransaction.type === 'card') {
    // account.title = 'Счет ' + rawTransaction.currency // 'Счет RUB'
    account.syncIds.push(rawTransaction.cards.toString())
  }
  return account
}

export function convertCard (rawTransaction) {
  if (rawTransaction.category !== 'card') {
    console.log('Unexpected category ' + rawTransaction.category)
    return null
  }
  const account = {
    id: rawTransaction.primaryAccount,
    storedId: rawTransaction.storedId.toString(), // На этот id приходят платежи при стягивании.
    type: 'ccard',
    title: rawTransaction.name, // 'Mastercard Unembossed'
    instrument: rawTransaction.currency, // 'RUB'
    balance: rawTransaction.availableBalance, // <= json.balance
    creditLimit: 0,
    syncIds: [
      rawTransaction.pan,
      rawTransaction.storedId.toString()
    ]
  }
  return account
}

export function convertDeposit (rawTransaction) {
  let payoffInterval = {}
  for (const pattern of [
    /В конце срока/i,
    /Ежеквартально/i
  ]) {
    const match = rawTransaction.percentPaidPeriod.match(pattern)
    if (match) {
      payoffInterval = null
    }
  }
  /*
  const payoffInterval = {
    'В конце срока': null
  }[rawTransaction.percentPaidPeriod]
  */
  if (payoffInterval === undefined) {
    console.log('Unexpected percentPaidPeriod ' + rawTransaction.percentPaydPeriod)
    return null
  }
  let payoffStep = 1
  if (payoffInterval === null) {
    payoffStep = 0
  }
  const account = {
    id: rawTransaction.account,
    type: 'deposit',
    title: rawTransaction.name,
    instrument: rawTransaction.currency,
    balance: rawTransaction.balance,
    capitalization: rawTransaction.capitalization,
    percent: rawTransaction.rate,
    startDate: new Date(parseDate(rawTransaction.open_date)),
    startBalance: rawTransaction.opening_balance,
    endDateOffset: Number(rawTransaction.duration),
    endDateOffsetInterval: 'day',
    payoffInterval: payoffInterval,
    payoffStep: payoffStep,
    syncIds: [rawTransaction.account]
  }
  return account
}

export function convertLoan (rawTransaction) {
  const fromDate = new Date(parseDate(rawTransaction.openDate))
  const toDate = new Date(parseDate(rawTransaction.endDate))
  const { interval, count } = getIntervalBetweenDates(fromDate, toDate)
  /*
  const payoffInterval = {
    'В конце срока': null
  }[rawTransaction.percentPaidPeriod]
  if (payoffInterval === undefined) {
    console.log('Unexpected percentPaidPeriod ' + rawTransaction.percentPaydPeriod)
    return null
  }
  let payoffStep = 1
  if (payoffInterval === null) {
    payoffStep = 0
  }
  */
  const account = {
    id: rawTransaction.repaymentAccount,
    mainAccount: rawTransaction.mainAccount,
    type: 'loan',
    title: rawTransaction.name,
    instrument: rawTransaction.currency,
    balance: -rawTransaction.amount,
    capitalization: rawTransaction.capitalization || true,
    percent: rawTransaction.interestRate,
    startDate: fromDate,
    endDateOffset: count,
    endDateOffsetInterval: interval,
    syncIds: [
      rawTransaction.mainAccount,
      rawTransaction.repaymentAccount
    ]
  }
  return account
}

export function findId (rawTransaction, accounts) {
  let accountsById = {}
  for (let a = 0; a < accounts.length; a++) {
    const accountId = {}
    const account = accounts[a]
    for (let i = 0; i < account.syncIds.length; i++) {
      accountId[account.syncIds[i]] = {
        id: account.id
      }
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

export function convertTransaction (accounts, rawTransaction, accountIds) {
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

  return transaction
}

function parseTransferAccountTransaction (rawTransaction, transaction, invoice, accountIds) {
  for (const pattern of [
    /p2p/i,
    /sbp_in/i,
    /transfer-own/i,
    /transfer_rub/i
  ]) {
    const match = rawTransaction.info.subType.match(pattern)
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
        transaction.movements[1].account.syncIds = [card[1]]
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
/*
function parseTransferInnerTransaction (rawTransaction, transaction, invoice, accountIds) {
  if (accountIds.findIndex(transaction.movements[0].account.syncIds) !== -1 &&
    accountIds.findIndex(transaction.movements[1].account.syncIds) !== -1) {
    transaction.comment = 'internal' // ???? Что тут надо ???
    console.log(transaction.comment)
  }
  return transaction.comment
}
*/

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
