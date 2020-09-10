import { fetchProducts, fetchTransactions, login } from './api'
import { convertAccount, convertCard, convertDeposit, convertLoan, findId, convertTransaction } from './converters'

export async function scrape ({ preferences, fromDate, toDate }) {
  await login(preferences.login, preferences.password)
  const products = await fetchProducts()
  let accounts = products.cards.map(convertCard).filter(x => !!x)
  accounts = accounts.concat(products.accounts.map(convertAccount).filter(x => !!x))
  accounts = accounts.concat(products.deposits.map(convertDeposit).filter(x => !!x))
  accounts = accounts.concat(products.loans.map(convertLoan).filter(x => !!x))
  const accountIds = accounts.map(findId)
  const operations = await fetchTransactions(fromDate, toDate)
  const transactions = operations.map(transaction => convertTransaction(transaction, accounts, accountIds))
  return {
    accounts: accounts,
    transactions: transactions
  }
}
