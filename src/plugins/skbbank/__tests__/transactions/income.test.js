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
