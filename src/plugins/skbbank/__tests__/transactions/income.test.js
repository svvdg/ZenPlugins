import { convertTransaction } from '../../converters'

describe('convertTransaction', () => {
  it.each([
    [
      {
        info:
          {
            id: 847324006,
            operationType: 'account_transaction',
            skbPaymentOperationType: null,
            subType: 'transfer-in',
            hasOfdReceipt: false
          },
        view:
          {
            operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846257.png',
            descriptions:
              {
                operationDescription: 'ВАСИЛЬЕВ ВАСИЛИЙ ВАСИЛЬЕВИЧ',
                productDescription: 'Счет RUB',
                productType: 'На счет'
              },
            amounts:
              {
                amount: 6000,
                currency: 'RUB',
                feeAmount: 0,
                feeCurrency: 'RUB',
                bonusAmount: 0,
                bonusCurrency: 'RUB',
                cashBackAmount: 0,
                cashBackCurrency: 'RUB'
              },
            mainRequisite: null,
            actions: ['sendCheck', 'print', 'reversePayment'],
            category:
              {
                id: 394010366,
                internalCode: 'replenishment',
                name: 'Пополнения'
              },
            state: 'processed',
            dateCreated: '2020-07-13T05:47:02+05:00',
            payWallet: null,
            direction: 'credit',
            comment: null,
            productAccount: '40817810239923088530',
            productCardId: null
          }
      },
      {
        date: '2020-07-13T05:47:02+05:00',
        hold: false,
        comment: null,
        merchant: {
          country: null,
          city: null,
          title: 'ВАСИЛЬЕВ ВАСИЛИЙ ВАСИЛЬЕВИЧ',
          mcc: null,
          location: null
        },
        movements: [
          {
            id: '847324006',
            account: { id: 'accounts' },
            invoice: null,
            sum: 6000,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert income', (rawTransaction, transaction) => {
    const accounts = { id: 'accounts', instrument: 'RUB' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })
})

/*
info:
{ id: 847324006,
  operationType: 'account_transaction',
  skbPaymentOperationType: null,
  subType: 'transfer-in',
  hasOfdReceipt: false },
view:
{ operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846257.png',
  descriptions:
  { operationDescription: 'ИСАЕВ МАКСИМ ВАСИЛЬЕВИЧ',
    productDescription: 'Счет RUB',
    productType: 'На счет' },
  amounts:
  { amount: 6000,
    currency: 'RUB',
    feeAmount: 0,
    feeCurrency: 'RUB',
    bonusAmount: 0,
    bonusCurrency: 'RUB',
    cashBackAmount: 0,
    cashBackCurrency: 'RUB' },
  mainRequisite: null,
    actions: [ 'sendCheck', 'print', 'reversePayment' ],
  category:
  { id: 394010366,
    internalCode: 'replenishment',
    name: 'Пополнения' },
  state: 'processed',
    dateCreated: '2020-07-13T05:47:02+05:00',
  payWallet: null,
  direction: 'credit',
  comment: null,
  productAccount: '40817810239923082636',
  productCardId: null }

info:
{ id: 847324007,
  operationType: 'account_transaction',
  skbPaymentOperationType: null,
  subType: 'loan-repayment',
  hasOfdReceipt: false },
view:
{ operationIcon: 'https://ib.delo.ru/imgcache/operation_category394010369v11.png',
  descriptions:
  { operationDescription: 'Погашение кредита',
    productDescription: 'Счет RUB',
    productType: 'Со счета' },
  amounts:
  { amount: 6000,
    currency: 'RUB',
    feeAmount: 0,
    feeCurrency: 'RUB',
    bonusAmount: 0,
    bonusCurrency: 'RUB',
    cashBackAmount: 0,
    cashBackCurrency: 'RUB' },
  mainRequisite: '"ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ (потребительский кредит)" от 13.03.2014 на сумму 216 300,00 рублей',
    actions: [ 'sendCheck', 'print' ],
  category: { id: 394010369, internalCode: 'loan', name: 'Кредиты' },
  state: 'processed',
    dateCreated: '2020-07-13T22:55:50+05:00',
  payWallet: null,
  direction: 'debit',
  comment: null,
  productAccount: '40817810239923082636',
  productCardId: null }

info:
{ id: 856924346,
  operationType: 'payment',
  skbPaymentOperationType: 'p2p',
  subType: 'p2p',
  hasOfdReceipt: false },
view:
{ operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846246.png',
  descriptions:
  { operationDescription: 'В "СКБ-Банк" на карту ***6004',
    productDescription: 'Сбербанк',
    productType: 'C карты' },
  amounts:
  { amount: 10000,
    currency: 'RUB',
    feeAmount: 0,
    feeCurrency: 'RUB',
    bonusAmount: 0,
    bonusCurrency: null,
    cashBackAmount: 0,
    cashBackCurrency: null },
  mainRequisite: 'С карты ***4617',
    actions: [ 'sendCheck', 'print', 'toFavorite', 'repeatable' ],
  category: { id: 394010367, internalCode: 'transfer', name: 'Переводы' },
  state: 'rejected',
    dateCreated: '2020-08-22T17:23:19+05:00',
  payWallet: false,
  direction: 'credit',
  comment: null,
  productAccount: null,
  productCardId: 170971097 }

 */
