import { convertTransaction } from '../../converters'

describe('convertTransaction', () => {
  it.each([
    [
      {
        info: {
          id: 900000001,
          operationType: 'card_transaction',
          skbPaymentOperationType: null,
          subType: 'purchase',
          hasOfdReceipt: false
        },
        view: {
          operationIcon: 'https://ib.delo.ru/imgcache/br21046010ic350545280v0.png',
          descriptions: {
            operationDescription: 'Пятерочка',
            productDescription: 'Mastercard Unembossed',
            productType: 'С карты'
          },
          amounts: {
            amount: 789.67,
            currency: 'RUB',
            feeAmount: 0,
            feeCurrency: 'RUB',
            bonusAmount: 0,
            bonusCurrency: 'RUB',
            cashBackAmount: 0,
            cashBackCurrency: 'RUB'
          },
          mainRequisite: 'МСС: 5411',
          actions: ['sendCheck', 'print', 'dispute'],
          category: {
            id: 394010344,
            internalCode: 'supermarket',
            name: 'Супермаркеты'
          },
          state: 'accepted',
          dateCreated: '2020-08-09T17:55:44+05:00',
          payWallet: true,
          direction: 'debit',
          comment: null,
          productAccount: '40817810700012345678',
          productCardId: 85858585
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
            id: '8991874667',
            account: { id: 'card' },
            invoice: null,
            sum: 2000000.00,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert usual payment', (rawTransaction, transaction) => {
    const accounts = { id: 'accounts', instrument: 'RUB' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })
})
