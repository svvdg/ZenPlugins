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
  return {
    id: rawTransaction.account,
    type: 'deposit',
    title: rawTransaction.name,
    instrument: rawTransaction.currency,
    balance: rawTransaction.balance,
    capitalization: rawTransaction.capitalization,
    percent: rawTransaction.rate,
    startDate: rawTransaction.open_date,
    endDateOffset: Number(rawTransaction.duration),
    endDateOffsetInterval: 'day',
    payoffInterval: payoffInterval,
    payoffStep: payoffStep,
    syncids: [rawTransaction.account.slice(-4)]
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

export function convertTransaction (account, rawTransaction) {
  const invoice = {
    sum: rawTransaction.view.amounts.amount,
    instrument: rawTransaction.view.amounts.currency
  }
  // Для операции стягивания в productAccount будет null, в productCardId - идентификатор внешней карты.
  let accountId = rawTransaction.view.productAccount || rawTransaction.view.productCardId
  if (!accountId && rawTransaction.info.operationType === 'payment') {
    accountId = findAccountByStoredId(account, rawTransaction.details['payee-card']).id
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
        account: { id: account.id },
        invoice: invoice.instrument === account.instrument ? null : invoice,
        sum: invoice.instrument === account.instrument ? invoice.sum : rawTransaction.details.convAmount,
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
  ].some(parser => parser(rawTransaction, transaction, invoice))

  return transaction
}

function parseTransferAccountTransaction (rawTransaction, transaction, invoice) {
  if (rawTransaction.view.direction === 'credit') {
    for (const pattern of [
      // /Отправка денежного/i,
      /Перевод/i
      // /Переводы/i
    ]) {
      const match = rawTransaction.view.comment.match(pattern)
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
