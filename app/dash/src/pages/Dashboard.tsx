import { useState, useEffect } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { getBalances } from '@/api/client'
import { BalanceCard } from '@/components/BalanceCard'
import { TransactionRow } from '@/components/TransactionRow'

interface Account {
  id: string
  entityName: string
  entityType: string
  currency: string
  status: string
}

interface Balance {
  currency: string
  available: number
  held: number
}

interface Transaction {
  id: string
  type: string
  direction: string
  amount: number
  currency: string
  status: string
  reference: string
  created: string
}

export function Dashboard() {
  const { data: accountsData } = useRecords<Account>({
    collection: 'accounts',
    perPage: 50,
    sort: '-created',
  })

  const [balances, setBalances] = useState<Balance[]>([])

  const { data: txData } = useRecords<Transaction>({
    collection: 'transactions',
    perPage: 10,
    sort: '-created',
  })

  // Fetch balances for the first account.
  useEffect(() => {
    const first = accountsData?.items?.[0]
    if (!first) return
    getBalances(first.id).then(setBalances).catch(() => {})
  }, [accountsData])

  const accounts = accountsData?.items || []
  const transactions = txData?.items || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Account summary */}
      {accounts.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            {accounts[0].entityName} - {accounts[0].entityType}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {balances.map((b) => (
              <BalanceCard key={b.currency} {...b} />
            ))}
            {balances.length === 0 && (
              <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">
                No balances available
              </p>
            )}
          </div>
        </div>
      )}

      {accounts.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No accounts found</p>
      )}

      {/* Recent transactions */}
      <div>
        <h2 className="mb-3 text-lg font-medium">Recent transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="[&_td]:px-4">
                {transactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
