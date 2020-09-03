import { convertTransaction } from '../../converters'

describe('convertTransaction', () => {
  it.each([
    [
      {
        info: {
          id: 900000001,
          operationType: 'payment',
          skbPaymentOperationType: 'transfer_rub',
          subType: 'transfer_rub',
          hasOfdReceipt: false
        },
        view: {
          operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846246.png',
          descriptions: {
            operationDescription: 'Между счетами',
            productDescription: 'Счет RUB',
            productType: 'Со счета'
          },
          amounts: {
            amount: 1000,
            currency: 'RUB',
            feeAmount: 0,
            feeCurrency: 'RUB',
            bonusAmount: 0,
            bonusCurrency: null,
            cashBackAmount: 0,
            cashBackCurrency: null
          },
          mainRequisite: 'На "Счет Mastercard Unembossed"',
          actions: ['sendCheck', 'print', 'toFavorite', 'repeatable'],
          category: {
            id: 394010367,
            internalCode: 'transfer',
            name: 'Переводы'
          },
          state: 'processed',
          dateCreated: '2020-08-09T19:23:32+05:00',
          payWallet: false,
          direction: 'internal',
          comment: null,
          productAccount: '40817810900016392697',
          productCardId: null
        },
        details: {
          actions: ['sendCheck', 'print', 'toFavorite', 'repeatable'],
          amount: 1000,
          'another-person-payment': null,
          bankSystemId: '6741705204',
          bonusAmount: null,
          category: {
            id: 394010367,
            name: 'Переводы'
          },
          charge: '2020-08-09T00:00:00+05:00',
          comment: null,
          controlValue: null,
          convAmount: null,
          convCurrency: null,
          counterpartyId: null,
          'create-date': '2020-08-09T19:23:32+05:00',
          currency: 'RUB',
          data_contacts: {},
          dateCreated: '2020-08-09T19:23:32+05:00',
          'debtor-city': null,
          'debtor-flat': null,
          'debtor-house': null,
          'debtor-inn': null,
          'debtor-kpp': null,
          'debtor-lastname': null,
          'debtor-middlename': null,
          'debtor-name': null,
          'debtor-nonResident': null,
          'debtor-street': null,
          'debtor-type': null,
          direction: 'internal',
          ekassir: false,
          feeAmount: 0,
          feeCurrency: 'RUB',
          fields: {},
          firstCurrency: null,
          icon: {
            hash: '1a751336e99fa57c3295ab785571db69',
            url: '/imgcache/bankData628293674_1a751336e99fa57c3295ab785571db69.png'
          },
          internalCode: null,
          kvvo: null,
          limit: null,
          linked_document_id: null,
          linked_document_type: null,
          mainRequisite: 'На "Счет Mastercard Unembossed"',
          nds: 20,
          ndsType: '3',
          operationDescription: 'Между счетами',
          operationIcon: 'https://ib.delo.ru/imgcache/bankIcon_ii312846246.png',
          'order-date': '2020-08-09',
          orderedRequisites: [],
          originalRegistry: null,
          outdated: false,
          'payee-account': '40817810700012345678',
          'payee-bank-account': '30101810045250000000',
          'payee-bank-bic': '044520000',
          'payee-bank-name': 'ФИЛИАЛ "МОСКОВСКИЙ" ПАО "СКБ-БАНК"',
          'payee-card': null,
          'payee-card-id': null,
          'payee-card-mask-pan': null,
          'payee-inn': null,
          'payee-kpp': null,
          'payee-member-id': null,
          'payee-name': 'Иванов Иван Иванович',
          'payee-phone': null,
          'payer-account': '40817810900087654321',
          'payer-bank-account': '30101810045250000000',
          'payer-bank-bic': '044520000',
          'payer-bank-name': 'ФИЛИАЛ "МОСКОВСКИЙ" ПАО "СКБ-БАНК"',
          'payer-card': null,
          'payer-card-mask-pan': null,
          'payer-inn': null,
          'payer-kpp': null,
          'payment-date': null,
          'payment-kind': null,
          'payment-number': '3',
          'payment-operation-type': 'transfer',
          'payment-type': null,
          payout: null,
          'payout.date': null,
          'payout.type': null,
          pointOfInitiationMethod: null,
          priority: '5',
          productAccount: '40817810900087654321',
          productCardId: null,
          productDescription: 'Счет RUB',
          productType: 'Со счета',
          profit: null,
          purpose: 'Перевод между счетами.',
          purposeCode: null,
          qrIdentifier: null,
          rate: null,
          reason: null,
          registryPaidAmount: null,
          requisites: {},
          'rest-amount': null,
          revokeRejectReason: null,
          secondCurrency: 'RUB',
          skbPaymentOperationType: 'transfer_rub',
          state: 'processed',
          uin: null
        }
      },
      {
        date: '2020-08-09T19:23:32+05:00',
        hold: false,
        comment: 'На "Счет Mastercard Unembossed"',
        merchant: {
          country: null,
          city: null,
          title: 'Между счетами',
          mcc: null,
          location: null
        },
        movements: [
          {
            id: '900000001',
            account: { id: 'account' },
            invoice: null,
            sum: 1000,
            fee: 0
          },
          {
            id: null,
            account: {
              type: null,
              instrument: 'RUB',
              syncIds: ['40817810900016392697'],
              company: null
            },
            invoice: null,
            sum: -1000,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert transfer', (rawTransaction, transaction) => {
    const accounts = { id: 'account', instrument: 'RUB' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        info: {
          id: 850999999,
          operationType: 'account_transaction',
          skbPaymentOperationType: null,
          subType: 'transfer-own',
          hasOfdReceipt: false
        },
        view: {
          operationIcon: 'https://ib.delo.ru/imgcache/operation_category394010367v11.png',
          descriptions: {
            operationDescription: 'Вклады: открытие вклада Исполнение желаний        +',
            productDescription: 'Счет Mastercard Unembossed',
            productType: 'Со счета карты'
          },
          amounts: {
            amount: 10000,
            currency: 'RUB',
            feeAmount: 0,
            feeCurrency: 'RUB',
            bonusAmount: 0,
            bonusCurrency: 'RUB',
            cashBackAmount: 0,
            cashBackCurrency: 'RUB'
          },
          mainRequisite: 'На "Исполнение желаний + (срочный вклад)"',
          actions: ['sendCheck', 'print'],
          category: {
            id: 394010367,
            internalCode: 'transfer',
            name: 'Переводы'
          },
          state: 'processed',
          dateCreated: '2020-08-07T16:16:16+05:00',
          payWallet: null,
          direction: 'internal',
          comment: null,
          productAccount: '40817810700012345678',
          productCardId: null
        },
        details: {
          actions: ['sendCheck', 'print'],
          amount: 10000,
          bankSystemId: '6741190000',
          category: {
            id: 394010367,
            internalCode: 'transfer',
            name: 'Переводы'
          },
          chargeDate: '2020-08-07T16:16:16+05:00',
          comment: 'Перевод между счетами через систему ДБО',
          convAmount: null,
          convCurrency: null,
          currency: 'RUB',
          dateCreated: '2020-08-07T16:16:16+05:00',
          descriptions: {
            operationDescription: 'Вклады: открытие вклада Исполнение желаний        +',
            productDescription: 'Счет Mastercard Unembossed',
            productType: 'Со счета карты'
          },
          direction: 'internal',
          feeAmount: 0,
          feeCurrency: 'RUB',
          firstCurrency: null,
          id: 850999999,
          mainRequisite: 'На "Исполнение желаний + (срочный вклад)"',
          operationIcon: 'https://ib.delo.ru/imgcache/operation_category394010367v11.png',
          orderedRequisites: [],
          payeeAccount: '42305810330000000042',
          payeeBic: '044520000',
          payerAccount: '40817810700012345678',
          payerBic: '044520000',
          productAccount: '40817810700012345678',
          productCardId: null,
          rate: null,
          requisites: {},
          secondCurrency: null,
          state: 'processed',
          transactionType: 'transfer-own'
        }
      },
      {
        date: '2020-08-07T16:16:16+05:00',
        hold: false,
        comment: 'На "Исполнение желаний + (срочный вклад)"',
        merchant: {
          country: null,
          city: null,
          title: 'Вклады: открытие вклада Исполнение желаний        +',
          mcc: null,
          location: null
        },
        movements: [
          {
            id: '850999999',
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
              syncIds: ['40817810700012345678'],
              company: null
            },
            invoice: null,
            sum: -10000,
            fee: 0
          }
        ]
      }
    ]
  ])('should convert account transaction', (rawTransaction, transaction) => {
    const accounts = { id: 'account', instrument: 'RUB' }
    expect(convertTransaction(accounts, rawTransaction)).toEqual(transaction)
  })
})

/*
expect(transaction).toEqual({
  id: '900000001',
  hold: false,
  date: '2020-08-09T19:23:32+05:00',
  income: 1000,
  incomeAccount: '40817810900087654321',
  outcome: 1000,
  outcomeAccount: '40817810700012345678',
  comment: 'Между счетами'
})
 */

/*
expect(transaction).toEqual({
  id: '850999999',
  hold: false,
  date: '2020-08-07T16:16:16+05:00',
  income: 10000,
  incomeAccount: '40817810700012345678',
  outcome: 10000,
  outcomeAccount: '42305810330000000042',
  comment: 'Вклады: открытие вклада Исполнение желаний        +'
})

 */
