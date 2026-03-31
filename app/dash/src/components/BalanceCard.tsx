import { formatAmount } from '@/lib/format'

interface Props {
  currency: string
  available: number
  held: number
}

export function BalanceCard({ currency, available, held }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{currency}</p>
      <p className="mt-1 text-2xl font-semibold">{formatAmount(available, currency)}</p>
      {held > 0 && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formatAmount(held, currency)} held
        </p>
      )}
    </div>
  )
}
