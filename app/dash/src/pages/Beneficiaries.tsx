import { useRecords } from '@/hooks/useRecords'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate } from '@/lib/format'

interface Beneficiary {
  id: string
  name: string
  bankAccountHolder: string
  currency: string
  country: string
  paymentType: string
  verified: boolean
  created: string
}

export function Beneficiaries() {
  const { data, loading } = useRecords<Beneficiary>({
    collection: 'beneficiaries',
    perPage: 50,
    sort: '-created',
    expand: 'account',
  })

  const items = data?.items || []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Beneficiaries</h1>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Account holder</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3">{b.bankAccountHolder}</td>
                <td className="px-4 py-3">{b.currency}</td>
                <td className="px-4 py-3">{b.country}</td>
                <td className="px-4 py-3 capitalize">{b.paymentType || '-'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.verified ? 'approved' : 'pending'} />
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {formatDate(b.created)}
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No beneficiaries
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
