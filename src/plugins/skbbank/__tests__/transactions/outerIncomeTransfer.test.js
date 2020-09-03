import { convertTransaction } from '../../converters'

describe('convertTransaction', () => {
  it.each([
    [
      {
        info:
          {
            id: 855984970,
            operationType: 'account_transaction',
            skbPaymentOperationType: null,
            subType: 'sbp_in',
            hasOfdReceipt: false
          },
        view:
          {
            operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846257.png',
            descriptions:
              {
                operationDescription: 'Николаев Николай Николаевич',
                productDescription: 'Счет Mastercard Unembossed',
                productType: 'На счет карты'
              },
            amounts:
              {
                amount: 10000,
                currency: 'RUB',
                feeAmount: 0,
                feeCurrency: 'RUB',
                bonusAmount: 0,
                bonusCurrency: 'RUB',
                cashBackAmount: 0,
                cashBackCurrency: 'RUB'
              },
            mainRequisite: 'Из АО "ТИНЬКОФФ БАНК"',
            actions: ['sendCheck', 'print', 'reversePayment'],
            category:
              {
                id: 394010366,
                internalCode: 'replenishment',
                name: 'Пополнения'
              },
            state: 'processed',
            dateCreated: '2020-08-20T11:08:36+05:00',
            payWallet: null,
            direction: 'credit',
            comment: 'Перевод с использованием Системы быстрых платежей',
            productAccount: '40817810100015387612',
            productCardId: null
          }
      },
      {
        date: new Date('2020-08-20T06:08:36.000Z'),
        hold: false,
        comment: 'Перевод с использованием Системы быстрых платежей',
        merchant: {
          country: null,
          city: null,
          title: 'Николаев Николай Николаевич',
          mcc: null,
          location: null
        },
        movements: [
          {
            id: '855984970',
            account: { id: 'account' },
            invoice: null,
            sum: 10000,
            fee: 0
          },
          {
            id: null,
            account: {
              type: null,
              instrument: 'RUB',
              syncIds: ['40817810100015387612'],
              company: null
            },
            invoice: null,
            sum: -10000.00,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert SBP transfer', (rawTransaction, transaction) => {
    const accounts = { id: 'account', instrument: 'RUB' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        info:
          {
            id: 856924379,
            operationType: 'payment',
            skbPaymentOperationType: 'p2p',
            subType: 'p2p',
            hasOfdReceipt: false
          },
        view:
          {
            operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846246.png',
            descriptions:
              {
                operationDescription: 'В "СКБ-Банк" на карту ***6004',
                productDescription: 'Сбербанк',
                productType: 'C карты'
              },
            amounts:
              {
                amount: 10000,
                currency: 'RUB',
                feeAmount: 0,
                feeCurrency: 'RUB',
                bonusAmount: 0,
                bonusCurrency: null,
                cashBackAmount: 0,
                cashBackCurrency: null
              },
            mainRequisite: 'С карты ***4617',
            actions: ['sendCheck', 'print', 'toFavorite', 'repeatable'],
            category: { id: 394010367, internalCode: 'transfer', name: 'Переводы' },
            state: 'processed',
            dateCreated: '2020-08-22T17:23:49+05:00',
            payWallet: false,
            direction: 'credit',
            comment: null,
            productAccount: null,
            productCardId: 170971097
          }
      },
      {
        date: new Date('2020-08-22T12:23:49.000Z'),
        hold: false,
        comment: 'С карты ***4617',
        merchant: {
          country: null,
          city: null,
          title: 'В "СКБ-Банк" на карту ***6004',
          mcc: null,
          location: null
        },
        movements: [
          {
            id: '856924379',
            account: { id: 'account' },
            invoice: null,
            sum: 10000,
            fee: 0
          },
          {
            id: null,
            account: {
              type: null,
              instrument: 'RUB',
              syncIds: [null],
              company: null
            },
            invoice: null,
            sum: -10000.00,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert Card transfer', (rawTransaction, transaction) => {
    const accounts = { id: 'account', instrument: 'RUB' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })
})

/*

})).toEqual({
    comment: 'Николаев Николай Николаевич',
      date: '2020-08-20T11:08:36+05:00',
      hold: false,
      id: '855984970',
      income: 10000,
      incomeAccount: '40817810100015387612',
      outcome: 0,
      outcomeAccount: '40817810100015387612'
    })
  })

*/
