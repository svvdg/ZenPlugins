import { convertAccount, convertCard, convertDeposit } from '../../converters'

describe('convertCard', () => {
  it('should convert debit card account', () => {
    const account = convertCard({
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
    })

    expect(account).toEqual({
      id: '40817810700012345678',
      type: 'ccard',
      title: 'Mastercard Unembossed',
      instrument: 'RUB',
      balance: 12345.00,
      creditLimit: 0,
      storedId: '31072020',
      syncID: [
        '7890'
      ]
    })
  })
})

describe('convertAccount', () => {
  it('should convert current account', () => {
    const account = convertAccount({
      id: 42424242,
      customName: false,
      name: 'Счет RUB',
      productName: 'Счет RUB',
      number: '40817810900087654321',
      state: 'Открыт',
      stateCode: 'open',
      amount: 1000.00,
      type: 'current',
      registryAmount: 0,
      registry2Amount: 0,
      balance: 1000.00,
      currency: 'RUB',
      availableBalance: 1000.00,
      availBalanceRub: 1000.00,
      startDate: '08.08.2020',
      order: 99,
      category: 'account',
      requisites: {
        bankName: 'ФИЛИАЛ "МОСКОВСКИЙ" ПАО "СКБ-БАНК"',
        address: 'Россия, 109004, Москва г, Москва г, Николоямская ул, д.40/22, корп.4',
        bic: '044520000',
        inn: '',
        kpp: '775002001',
        corrAccount: '30101810045250000472'
      },
      allowInPayments: true,
      allowOutPayments: true,
      allowLoanRepayment: true,
      tariffPlanName: 'Универсальный',
      tariffPlanCode: '',
      tariffPlanLinkToRules: '',
      specType: 'EX',
      mostActive: false,
      pdfLink: '/export/account/pdf?id=42424242',
      overdraft: false,
      sbpDefault: false,
      bonusProgramState: 'forbidden',
      availableBonuses: 0,
      accruedBonuses: 0,
      nextAccrualDate: null,
      lockedAmount: 0,
      canClose: true,
      bonusProgramGroup: {
        firstCategory: '0',
        secondCategory: '0',
        thirdCategory: '0',
        selectCategoryDate: null
      },
      petitionId: 850361797
    })

    expect(account).toEqual({
      id: '40817810900087654321',
      type: 'checking',
      title: 'Счет RUB',
      instrument: 'RUB',
      balance: 1000.00,
      creditLimit: 0,
      syncID: [
        '4321'
      ]
    })
  })
})

describe('convertDeposit', () => {
  it('should convert deposit', () => {
    const deposit = convertDeposit({
      id: 850348772,
      bank_system_id: '16748162',
      contract_number: '30016740929',
      contract_date: '08.08.2020',
      close_account: '40817810700012345678',
      capitalization: true,
      currency: 'RUB',
      opening_balance: 10000.00,
      min_balance: 10000.00,
      balance: 10000.00,
      percentPaidPeriod: 'В конце срока',
      duration: '270',
      open_date: '08.08.2020',
      end_date: '05.05.2021',
      early_close: true,
      rate: 5.2000,
      ratePeriods: [],
      balanceRub: 10000.00,
      account: '42305810330000000042',
      branch_id: 69559,
      allow_out_payments: false,
      allow_in_payments: false,
      percent_manageable: false,
      capital_manageable: false,
      percent_account: '42305810330000000042',
      auto_prolongation: false,
      state: 'open',
      state_description: 'Действующий',
      customName: false,
      name: 'Исполнение желаний + (срочный вклад)',
      productName: 'Исполнение желаний + (срочный вклад)',
      percent_paid: 0.00,
      percent_accrued: 0.00,
      requisites: {
        bankName: 'ФИЛИАЛ "МОСКОВСКИЙ" ПАО "СКБ-БАНК"',
        address: 'Россия, 109004, Москва г, Москва г, Николоямская ул, д.40/22, корп.4',
        bic: '044520000',
        inn: '',
        kpp: '775002001',
        corrAccount: '30101810045250000472'
      },
      petitionId: 850348751,
      interestType: null,
      charity: 'forbidden'
    })
    expect(deposit).toEqual({
      id: '42305810330000000042',
      type: 'deposit',
      title: 'Исполнение желаний + (срочный вклад)',
      instrument: 'RUB',
      balance: 10000,
      capitalization: true,
      percent: 5.2,
      startDate: '08.08.2020',
      payoffInterval: null,
      payoffStep: 0,
      endDateOffset: 270,
      endDateOffsetInterval: 'day',
      syncID: ['0042']
    })
  })
})
