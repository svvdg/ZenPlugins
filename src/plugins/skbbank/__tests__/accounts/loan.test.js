import { convertLoan } from '../../converters'

describe('convertLoan', () => {
  it.each([
    [
      {
        id: 40681781,
        bank_system_id: '9625620',
        productName: 'Персональное предложение (потребительский кредит)',
        productCode: '1292',
        customName: true,
        name: 'ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ (потребительский кредит)',
        amount: 216300,
        currency: 'RUB',
        interestRate: 26.9,
        psk: 22.924,
        contractDate: '13.03.2014',
        contractNumber: '39913394134',
        openDate: '03.13.2014', // была дата '03.13.2014' надо '13.03.2014'. Переделать надо
        endDate: '11.13.2023', // const { interval, count } = getIntervalBetweenDates(startDate, endDate),
        allowPaymentAmount: 20878.61,
        partialPaymentDate: '14.09.2020',
        planPaymentAmount: 5900,
        mainAccount: '45507810939900624978',
        repaymentAccount: '40817810239923082636',
        recommendedPaymentAmount: 5900,
        partialPaymentAmount: null,
        prepayment: false,
        overdueDebtAmount: 0,
        overdraft: false,
        startPaymentPeriod: null,
        gracePeriodDate: null,
        creditLimit: null,
        availableLimit: null,
        prepaymentApplication: false,
        changeDate: false,
        ownFounds: null,
        changeRepaymentAccount: false,
        partialPaymentMarker: false,
        reduceLimit: false,
        closeLimit: false,
        prepaymentAmount: null,
        prepaymentId: null,
        prepaymentType: null,
        loanHolder: 'ПАО "СКБ-банк"',
        paymentsDelay: true,
        paymentsDelayId: null,
        scheduleChanged: false,
        mortgage: false,
        onlineRepayment: false,
        petitionId: null,
        minLimit: null
      },
      {
        id: '40817810239923082636', // или 45507810939900624978 ???
        type: 'loan',
        title: 'ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ (потребительский кредит)',
        instrument: 'RUB',
        balance: -216300,
        capitalization: true,
        percent: 26.9,
        startDate: new Date('2014-03-12T20:00:00.000Z'), // была дата '03.13.2014' надо '13.03.2014'. Переделать надо
        // payoffInterval: null,
        // payoffStep: 0,
        endDate: new Date('2023-11-12T21:00:00.000Z'), // была дата '03.13.2014' надо '13.03.2014'. Переделать надо'13.11.2023',
        endDateOffsetInterval: 'day',
        syncids: ['40817810239923082636']
      }
    ]
  ])('converts Loan', (rawTransaction, transaction) => {
    expect(convertLoan(rawTransaction)).toEqual(transaction)
  })
})
