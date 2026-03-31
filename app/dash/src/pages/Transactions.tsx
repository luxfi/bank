import { useState } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { TransactionRow } from '@/components/TransactionRow'

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

const statuses = ['', 'pending', 'processing', 'completed', 'failed', 'cancelled']
const types = ['', 'payment', 'conversion', 'deposit', 'withdrawal', 'fee']

export function Transactions() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const parts: string[] = []
  if (statusFilter) parts.push(`status = "${statusFilter}"`)
  if (typeFilter) parts.push(`type = "${typeFilter}"`)
  const filter = parts.join(' && ')

  const { data, loading } = useRecords<Transaction>({
    collection: 'transactions',
    page,
    perPage: 20,
    sort: '-created',
    filter: filter || undefined,
  })

  const transactions = data?.items || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="">All statuses</option>
          {statuses.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="">All types</option>
          {types.filter(Boolean).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

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
            {transactions.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-700"
          >
            Prev
          </button>
          <span className="text-gray-500 dark:text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
