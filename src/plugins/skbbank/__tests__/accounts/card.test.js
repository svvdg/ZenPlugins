import { convertCard } from '../../converters'

describe('convertCard', () => {
  it.each([
    [
      {
        id: '4141414',
        state_description: 'Действующая',
        blocked: false,
        name: 'Mastercard Unembossed',
        customName: false,
        amount: 12345.00,
        currency: 'RUB',
        pan: '123456******7890',
        cardholderName: '',
        category: 'card',
        expDate: '2024-01-31',
        balance: 12345.00,
        availableBalance: 12345.00,
        holdAmount: 623.87,
        primaryAccount: '40817810700012345678',
        accountId: 85851280,
        tariffLink: 'https://www.skbbank.ru/chastnym-licam/karty/icard',
        cardId: '4141414',
        brand: 'Mastercard Unembossed',
        storedId: 31072020,
        limits: [],
        status: '00',
        status_desc: 'Карта не блокирована',
        state: '2',
        kind: 'debit',
        loan_funds: 0.00,
        own_funds: 12345.00,
        used_loan_funds: 0.00,
        smsPhone: '79000000000',
        smsType: null,
        packageCashBack: 'forbidden',
        packageFreeCashOut: 'off',
        packageServ: false,
        paymentSystem: 'MC',
        limit_set_available: false,
        own_customer_card: true,
        holder_name: 'Иванов Иван Иванович',
        smsNotify: 30.00,
        highCashBack: 30.00,
        freeWithdraw: 30.00,
        canViewCvv2: false,
        smsService: false
      },
      {
        id: '40817810700012345678',
        type: 'ccard',
        title: 'Mastercard Unembossed',
        instrument: 'RUB',
        balance: 12345.00,
        creditLimit: 0,
        storedId: '31072020',
        syncIds: ['123456******7890']
      }
    ]
  ])('converts Card', (rawTransaction, transaction) => {
    expect(convertCard(rawTransaction)).toEqual(transaction)
  })
})
