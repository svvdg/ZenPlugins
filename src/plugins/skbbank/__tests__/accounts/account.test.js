import { convertAccount } from '../../converters'

describe('convertAccount', () => {
  it.each([
    [
      {
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
      },
      {
        id: '40817810900087654321',
        type: 'checking',
        title: 'Счет RUB',
        instrument: 'RUB',
        balance: 1000.00,
        creditLimit: 0,
        syncIds: ['40817810900087654321']
      }
    ]
  ])('converts Account', (rawTransaction, transaction) => {
    expect(convertAccount(rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        id: 40681777,
        customName: false,
        name: 'Счет RUB',
        productName: 'Счет RUB',
        number: '40817810239923082636',
        state: 'Открыт',
        stateCode: 'open',
        amount: 0,
        type: 'current',
        registryAmount: 0,
        registry2Amount: 0,
        balance: 0,
        currency: 'RUB',
        availableBalance: 0,
        availBalanceRub: 0,
        startDate: '13.03.2014',
        order: 1,
        category: 'account',
        requisites:
          {
            bankName: 'ФИЛИАЛ "ВОЛОГОДСКИЙ" ПАО "СКБ-БАНК"',
            address: 'Россия, 190031, Санкт-Петербург г, Московский пр-кт, д.2, корп.6, кв.77Н, лит.А',
            bic: '041909781',
            inn: '6608003052',
            kpp: '352543001',
            corrAccount: '30101810300000000781'
          },
        allowInPayments: true,
        allowOutPayments: true,
        allowLoanRepayment: false,
        tariffPlanName: 'Стандартный',
        tariffPlanCode: '',
        tariffPlanLinkToRules: '',
        specType: 'EP',
        mostActive: false,
        pdfLink: '/export/account/pdf?id=40681777',
        overdraft: false,
        sbpDefault: false,
        bonusProgramState: 'forbidden',
        availableBonuses: 0,
        accruedBonuses: 0,
        nextAccrualDate: null,
        lockedAmount: 0,
        canClose: false,
        bonusProgramGroup:
          {
            firstCategory: '0',
            secondCategory: '0',
            thirdCategory: '0',
            selectCategoryDate: null
          },
        petitionId: null,
        tariffPlanCanChange: false
      },
      {
        id: '40817810239923082636',
        type: 'checking',
        title: 'Счет RUB',
        instrument: 'RUB',
        balance: 0,
        creditLimit: 0,
        syncIds: ['40817810239923082636']
      }
    ]
  ])('converts Account Credit', (rawTransaction, transaction) => {
    expect(convertAccount(rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        id: 170522760,
        customName: false,
        name: 'Счет Mastercard Unembossed',
        productName: 'Счет Mastercard Unembossed',
        number: '40817810239923082636',
        state: 'Открыт',
        stateCode: 'open',
        amount: 7302.49,
        type: 'card',
        registryAmount: 0,
        registry2Amount: 0,
        balance: 36063.61,
        currency: 'RUB',
        availableBalance: 7302.49,
        availBalanceRub: 7302.49,
        startDate: '11.05.2019',
        order: 1,
        category: 'account',
        requisites:
          {
            bankName: 'ФИЛИАЛ "ВОЛЖСКИЙ" ПАО "СКБ-БАНК"',
            address: 'Россия, 400066, Волгоградская обл, Волгоград г, Коммунистическая ул, д.16',
            bic: '041856890',
            inn: '6608003052',
            kpp: '343503001',
            corrAccount: '30101810800000000890'
          },
        allowInPayments: true,
        allowOutPayments: true,
        allowLoanRepayment: true,
        tariffPlanName: 'Универсальный',
        tariffPlanCode: '',
        tariffPlanLinkToRules: '',
        specType: 'EX',
        mostActive: false,
        pdfLink: '/export/account/pdf?id=170522760',
        overdraft: false,
        sbpDefault: false,
        bonusProgramState: 'enabled',
        availableBonuses: 297.36,
        accruedBonuses: 425.22,
        nextAccrualDate: '2020-09-01',
        lockedAmount: 0,
        canClose: true,
        bonusProgramGroup:
          {
            firstCategory: '3',
            secondCategory: '3',
            thirdCategory: '3',
            selectCategoryDate: '2020-07-06T13:03:43.000+0500'
          },
        petitionId: null,
        tariffPlanCanChange: false,
        cards: [170537804]
      },
      {
        id: '40817810239923082636',
        type: 'checking',
        title: 'Счет Mastercard Unembossed', // или 'Счет RUB' ???
        instrument: 'RUB',
        balance: 36063.61,
        creditLimit: 0,
        syncIds: [
          '40817810239923082636',
          '170537804'
        ]
      }
    ]
  ])('converts Account Card', (rawTransaction, transaction) => {
    expect(convertAccount(rawTransaction)).toEqual(transaction)
  })
})
