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
        date: new Date('2020-07-15T05:53:07.000Z'),
        hold: false,
        comment: null,
        merchant: {
          country: null,
          city: null,
          title: 'YASHNABADSKIY FILIAL OAKB',
          mcc: null,
          location: null
        },
        movements: [
          {
            id: '41827588',
            account: { id: 'account' },
            invoice: null,
            sum: 4300000.00,
            fee: 0
          },
          {
            id: null,
            account: {
              type: null,
              instrument: 'UZS',
              syncIds: null,
              company: null
            },
            invoice: null,
            sum: -4300000.00,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert SBP transfer', (rawTransaction, transaction) => {
    const accounts = { id: 'accounts', instrument: 'RUB' }
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
