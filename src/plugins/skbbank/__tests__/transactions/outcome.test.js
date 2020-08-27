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

  it.each([
    [
      {
        info: {
          id: 347900002,
          operationType: 'card_transaction',
          skbPaymentOperationType: null,
          subType: 'purchase',
          hasOfdReceipt: false
        },
        view: {
          operationIcon: 'https://ib.delo.ru/imgcache/operation_category394010347v11.png',
          descriptions: {
            operationDescription: 'RESTORAN "VASILKI"',
            productDescription: 'Mastercard Unembossed',
            productType: 'С карты'
          },
          amounts: {
            amount: 43.95,
            currency: 'BYN',
            feeAmount: 0,
            feeCurrency: 'RUB',
            bonusAmount: 0,
            bonusCurrency: 'RUB',
            cashBackAmount: 0,
            cashBackCurrency: 'RUB'
          },
          mainRequisite: 'МСС: 5812',
          actions: ['sendCheck', 'print'],
          category: {
            id: 394010347,
            internalCode: 'restaurant',
            name: 'Рестораны и кафе'
          },
          state: 'processed',
          dateCreated: '2020-07-21T22:17:05+05:00',
          payWallet: false,
          direction: 'debit',
          comment: null,
          productAccount: '40817810700012345678',
          productCardId: 85858585
        },
        details: {
          id: 347900002,
          payerAccount: '40817810700012345678',
          payerBic: '044520000',
          payeeAccount: null,
          payeeBic: null,
          dateCreated: '2020-07-21T22:17:05+05:00',
          chargeDate: '2020-07-23T00:19:04+05:00',
          cardId: 4141414,
          description: 'Оплата',
          amount: 43.95,
          currency: 'BYN',
          feeAmount: 0,
          feeCurrency: 'RUB',
          convAmount: 1430.9,
          convCurrency: 'RUB',
          terminal: {
            name: 'RESTORAN "VASILKI"',
            address: 'PR.MOSKOVSKIY,9/1',
            city: 'VITEBSK'
          },
          authCode: '777777',
          mccCode: '5812',
          purpose: 'Списание со счета по операции: Оплата RESTORAN "VASILKI"    \\PR.MOSKOVSKIY,9/1\\VITEBSK      \\210013    BLRBLR',
          state: 'processed',
          payWallet: false,
          payWalletDeviceName: null,
          payWalletType: null,
          firstCurrency: 'BYN',
          secondCurrency: 'RUB',
          rate: 32.56,
          cashBackAmount: 0,
          cashBackCurrency: 'RUB',
          bonusAmount: 0,
          bonusCurrency: 'RUB',
          operationIcon: 'https://ib.delo.ru/imgcache/operation_category394010347v11.png',
          descriptions: {
            operationDescription: 'RESTORAN "VASILKI"',
            productDescription: 'Mastercard Unembossed',
            productType: 'С карты'
          },
          category: {
            id: 394010347,
            name: 'Рестораны и кафе'
          },
          direction: 'debit',
          mainRequisite: 'MCC: 5812',
          productAccount: '40817810700012345678',
          productCardId: 85858585,
          actions: ['sendCheck', 'print'],
          ofdReceipt: null
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
  ])('should convert payment in foreign currency', (rawTransaction, transaction) => {
    const accounts = { id: 'accounts', instrument: 'BYN' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })
})

/*
expect(transaction).toEqual({
  id: '900000001',
  hold: true,
  date: '2020-08-09T17:55:44+05:00',
  income: 0,
  incomeAccount: '40817810700012345678',
  mcc: 5411,
  outcome: 789.67,
  outcomeAccount: '40817810700012345678',
  payee: 'Пятерочка'
 */

/*
expect(transaction).toEqual({
  id: '347900002',
  hold: false,
  date: '2020-07-21T22:17:05+05:00',
  income: 0,
  incomeAccount: '40817810700012345678',
  outcome: 1430.9,
  outcomeAccount: '40817810700012345678',
  mcc: 5812,
  opOutcome: 43.95,
  opOutcomeInstrument: 'BYN',
  payee: 'RESTORAN "VASILKI"'
})
 */
