export function convertAccount (rawTransaction) {
  if (rawTransaction.type !== 'current') {
    return null
  }
  return {
    id: rawTransaction.number,
    type: 'checking',
    title: rawTransaction.name, // 'Счет RUB'
    balance: rawTransaction.balance,
    instrument: rawTransaction.currency,
    creditLimit: 0,
    syncids: [rawTransaction.number.slice(-4)]
  }
}

export function convertCard (rawTransaction) {
  if (rawTransaction.category !== 'card') {
    console.log('Unexpected category ' + rawTransaction.category)
    return null
  }
  return {
    id: rawTransaction.primaryAccount,
    storedId: rawTransaction.storedId.toString(), // На этот id приходят платежи при стягивании.
    type: 'ccard',
    title: rawTransaction.name, // 'Mastercard Unembossed'
    instrument: rawTransaction.currency, // 'RUB'
    balance: rawTransaction.availableBalance, // <= json.balance
    creditLimit: 0,
    syncids: [rawTransaction.pan]
  }
}

export function convertDeposit (rawTransaction) {
  let payoffInterval = {}
  for (const pattern of [
    // /Отправка денежного/i,
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
  return {
    id: rawTransaction.account,
    type: 'deposit',
    title: rawTransaction.name,
    instrument: rawTransaction.currency,
    balance: rawTransaction.balance,
    capitalization: rawTransaction.capitalization,
    percent: rawTransaction.rate,
    startDate: new Date(parseDate(rawTransaction.open_date)), // была дата '03.13.2014' надо '13.03.2014'. Переделать надо
    startBalance: rawTransaction.opening_balance,
    endDateOffset: Number(rawTransaction.duration),
    endDateOffsetInterval: 'day',
    payoffInterval: payoffInterval,
    payoffStep: payoffStep,
    syncids: [rawTransaction.account]
  }
}

export function convertLoan (rawTransaction) {
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
  return {
    id: rawTransaction.repaymentAccount,
    type: 'loan',
    title: rawTransaction.name,
    instrument: rawTransaction.currency,
    balance: -rawTransaction.amount,
    capitalization: rawTransaction.capitalization || true,
    percent: rawTransaction.interestRate,
    startDate: new Date(rawTransaction.openDate), // была дата '03.13.2014' надо '13.03.2014'. Переделать надо
    endDate: new Date(rawTransaction.endDate), // const { interval, count } = getIntervalBetweenDates(startDate, endDate),
    endDateOffsetInterval: 'day',
    // payoffInterval: payoffInterval,
    // payoffStep: payoffStep,
    syncids: [rawTransaction.repaymentAccount]
  }
}

function findAccountByStoredId (accounts, storedId) {
  for (const acc of accounts) {
    if (acc.storedId === storedId) {
      return acc
    }
  }
  console.assert(false, 'cannot find storedId ' + storedId)
}

export function convertTransaction (accounts, rawTransaction) { // Не надо обрабатывать:      view.state: 'rejected'      info.subType: 'loan-repayment',
  const invoice = {
    sum: rawTransaction.view.direction === 'debit' ? -rawTransaction.view.amounts.amount : rawTransaction.view.amounts.amount,
    instrument: rawTransaction.view.amounts.currency
  }
  // Для операции стягивания в productAccount будет null, в productCardId - идентификатор внешней карты.
  let accountId = rawTransaction.view.productAccount || rawTransaction.view.productCardId
  if (!accountId && rawTransaction.info.operationType === 'payment') {
    accountId = findAccountByStoredId(accounts, rawTransaction.details['payee-card']).id
  }

  const transaction = {
    date: rawTransaction.view.dateCreated,
    hold: rawTransaction.view.state !== 'processed',
    merchant: {
      country: null,
      city: null,
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
    // parseTitle,
    parseTransferAccountTransaction
    // parseTransferTransaction
  ].some(parser => parser(rawTransaction, transaction, invoice))

  return transaction
}

function parseTransferAccountTransaction (rawTransaction, transaction, invoice) {
  // if (rawTransaction.info.subType === 'p2p') {
  // console.log('ПРошел')
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
              // rawTransaction.view.mainRequisite.match('С карты (\\d+)')
            ],
            company: null
          },
          invoice: null,
          sum: -invoice.sum,
          fee: 0
        })
      return true
    }
  }
  return false
}

function parseDate (stringDate) {
  const pattern = /(\d{2}).(\d{2}).(\d{4})/
  const arrayDate = stringDate.match(pattern)
  const newDate = new Date(arrayDate[3], arrayDate[2] - 1, arrayDate[1])
  return newDate
}

/*
var pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
var arrayDate = stringDate.match(pattern);
var dt = new Date(arrayDate[3], arrayDate[2] - 1, arrayDate[1]);

var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
var dt = new Date(st.replace(pattern,'--'));
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
