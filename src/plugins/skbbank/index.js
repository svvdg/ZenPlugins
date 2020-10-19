import { fetchProducts, fetchTransactions, login } from './api'
import { convertAccounts, convertTransaction, findId } from './converters'

export async function scrape ({ preferences, fromDate, toDate }) {
  await login(preferences.login, preferences.password)
  const products = await fetchProducts()
  const accounts = convertAccounts(products)
  const accountsById = findId(accounts)
  const operations = await fetchTransactions(fromDate, toDate)
  const transactions = operations.map(transaction => convertTransaction(transaction, accountsById))
  return {
    accounts: accounts,
    transactions: transactions
  }
}
