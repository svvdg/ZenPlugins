import { findId } from '../../converters'

describe('convertFindId', () => {
  it.each([
    [
      {
        id: '40817810900087654321',
        type: 'checking',
        title: 'Счет RUB',
        instrument: 'RUB',
        balance: 1000.00,
        creditLimit: 0,
        syncIds: ['40817810900087654321']
      },
      {
        '40817810900087654321': {
          id: '40817810900087654321'
        }
      }
    ]
  ])('converts findId Account', (rawTransaction, transaction) => {
    const accounts = { id: 'account1', syncIds: ['syncIds1'] }
    expect(findId(accounts, rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        id: '40817810239923082636', // или 45507810939900624978 ???
        type: 'loan',
        title: 'ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ (потребительский кредит)',
        instrument: 'RUB',
        balance: -216300,
        capitalization: true,
        percent: 26.9,
        startDate: new Date('2014-03-12T20:00:00.000Z'),
        endDateOffset: 116, // ???
        endDateOffsetInterval: 'month',
        syncIds: ['40817810239923082636'] // mainAccount: '45507810939900624978',
      },
      {
        '40817810239923082636': { // или 45507810939900624978 ???
          id: '40817810239923082636'
        }
      }
    ]
  ])('converts findId Loan', (rawTransaction, transaction) => {
    const accounts = { id: 'account1', syncIds: ['syncIds1'] }
    expect(findId(accounts, rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        id: '40817810700012345678',
        type: 'ccard',
        title: 'Mastercard Unembossed',
        instrument: 'RUB',
        balance: 12345.00,
        creditLimit: 0,
        storedId: '31072020',
        syncIds: ['123456******7890']
      },
      {
        '123456******7890': {
          id: '40817810700012345678'
        }
      }
    ]
  ])('converts findId Ccard', (rawTransaction, transaction) => {
    const accounts = { id: 'account1', syncIds: ['syncIds1'] }
    expect(findId(accounts, rawTransaction)).toEqual(transaction)
  })

  it.each([
    [
      {
        id: '42305810330000000042',
        type: 'deposit',
        title: 'Исполнение желаний + (срочный вклад)',
        instrument: 'RUB',
        balance: 10000,
        capitalization: true,
        percent: 5.2,
        startDate: new Date('2020-08-07T21:00:00.000Z'),
        startBalance: 10000,
        payoffInterval: null,
        payoffStep: 0,
        endDateOffset: 270,
        endDateOffsetInterval: 'day',
        syncIds: ['42305810330000000042']
      },
      {
        '42305810330000000042': { // close_account: '40817810700012345678',
          id: '42305810330000000042'
        }
      }
    ]
  ])('converts findId Deposit', (rawTransaction, transaction) => {
    const accounts = { id: 'account1', syncIds: ['syncIds1'] }
    expect(findId(accounts, rawTransaction)).toEqual(transaction)
  })
})
