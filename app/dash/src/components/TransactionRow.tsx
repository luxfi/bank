import { formatAmount, formatDate, capitalize } from '@/lib/format'
import { StatusBadge } from './StatusBadge'

interface Props {
  tx: {
    id: string
    type: string
    direction: string
    amount: number
    currency: string
    status: string
    reference: string
    created: string
  }
}

export function TransactionRow({ tx }: Props) {
  const isCredit = tx.direction === 'credit'
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-3 pr-3">
        <p className="text-sm font-medium">{capitalize(tx.type)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.reference || '-'}</p>
      </td>
      <td className="py-3 pr-3 text-sm">
        <span className={isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
          {isCredit ? '+' : '-'}{formatAmount(tx.amount, tx.currency)}
        </span>
      </td>
      <td className="py-3 pr-3"><StatusBadge status={tx.status} /></td>
      <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(tx.created)}</td>
    </tr>
  )
}
