import { fetchProducts, fetchTransactions, login } from './api'
import { convertAccount, convertCard, convertDeposit, convertLoan, findId, convertTransaction } from './converters'

export async function scrape ({ preferences, fromDate, toDate }) {
  await login(preferences.login, preferences.password)
  const products = await fetchProducts()
  let accounts = products.cards.map(convertCard).filter(x => !!x)
  let accountIds = new Set(findId(convertCard))
  accounts = accounts.concat(products.accounts.map(convertAccount).filter(x => !!x))
  accountIds = Set.add(findId(convertAccount))
  accounts = accounts.concat(products.deposits.map(convertDeposit).filter(x => !!x))
  accountIds = Set.add(findId(convertDeposit))
  accounts = accounts.concat(products.loans.map(convertLoan).filter(x => !!x))
  accountIds = Set.add(findId(convertLoan))
  // const accountIds = Object.fromEntries(accounts.map(findId)) // или const accountIds = new Set(findId(accounts)) ???
  const operations = await fetchTransactions(fromDate, toDate)
  const transactions = operations.map(transaction => convertTransaction(transaction, accounts, accountIds))
  return {
    accounts: accounts,
    transactions: transactions
  }
}
