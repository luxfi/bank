import { useState, useEffect } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { getBalances } from '@/api/client'
import { StatusBadge } from '@/components/StatusBadge'
import { BalanceCard } from '@/components/BalanceCard'
import { formatDate } from '@/lib/format'

interface Account {
  id: string
  entityName: string
  entityType: string
  country: string
  currency: string
  status: string
  kycStatus: string
  riskRating: string
  created: string
}

interface Balance {
  currency: string
  available: number
  held: number
}

export function Accounts() {
  const { data, loading } = useRecords<Account>({
    collection: 'accounts',
    perPage: 50,
    sort: '-created',
  })

  const [selected, setSelected] = useState<string | null>(null)
  const [balances, setBalances] = useState<Balance[]>([])

  useEffect(() => {
    if (!selected) {
      setBalances([])
      return
    }
    getBalances(selected).then(setBalances).catch(() => setBalances([]))
  }, [selected])

  const accounts = data?.items || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Accounts</h1>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">KYC</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr
                key={a.id}
                onClick={() => setSelected(selected === a.id ? null : a.id)}
                className={`cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 ${
                  selected === a.id ? 'bg-gray-50 dark:bg-gray-900' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium">{a.entityName}</td>
                <td className="px-4 py-3 capitalize">{a.entityType}</td>
                <td className="px-4 py-3">{a.country}</td>
                <td className="px-4 py-3">{a.currency}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3"><StatusBadge status={a.kycStatus} /></td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(a.created)}</td>
              </tr>
            ))}
            {accounts.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No accounts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Balances panel */}
      {selected && (
        <div>
          <h2 className="mb-3 text-lg font-medium">Balances</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {balances.map((b) => (
              <BalanceCard key={b.currency} {...b} />
            ))}
            {balances.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No balances</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
