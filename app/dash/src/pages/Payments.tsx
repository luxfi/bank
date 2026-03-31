import { useState, type FormEvent } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { sendPayment } from '@/api/client'
import { formatAmount } from '@/lib/format'

interface Account {
  id: string
  entityName: string
  currency: string
}

interface Beneficiary {
  id: string
  name: string
  currency: string
  account: string
}

export function Payments() {
  const { data: accountsData } = useRecords<Account>({
    collection: 'accounts',
    perPage: 50,
    filter: 'status = "active"',
  })

  const [accountId, setAccountId] = useState('')
  const { data: beneData } = useRecords<Beneficiary>({
    collection: 'beneficiaries',
    perPage: 100,
    filter: accountId ? `account = "${accountId}"` : undefined,
    enabled: !!accountId,
  })

  const [beneficiaryId, setBeneficiaryId] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ transactionId: string; status: string } | null>(null)

  const accounts = accountsData?.items || []
  const beneficiaries = beneData?.items || []

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    const cents = Math.round(parseFloat(amount) * 100)
    if (isNaN(cents) || cents <= 0) {
      setError('Enter a valid amount')
      setLoading(false)
      return
    }

    try {
      const res = await sendPayment({
        accountId,
        beneficiaryId,
        amount: cents,
        currency,
        reference,
      })
      setResult(res)
      setAmount('')
      setReference('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Send payment</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}

        {result && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Payment submitted: {result.transactionId} ({result.status})
          </p>
        )}

        <div>
          <label className="block text-sm font-medium">Account</label>
          <select
            required
            value={accountId}
            onChange={(e) => { setAccountId(e.target.value); setBeneficiaryId('') }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.entityName} ({a.currency})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Beneficiary</label>
          <select
            required
            value={beneficiaryId}
            onChange={(e) => setBeneficiaryId(e.target.value)}
            disabled={!accountId}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="">Select beneficiary</option>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.currency})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Currency</label>
            <input
              type="text"
              required
              maxLength={3}
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Reference</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Payment reference"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        {amount && parseFloat(amount) > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sending {formatAmount(Math.round(parseFloat(amount) * 100), currency)}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !accountId || !beneficiaryId}
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {loading ? 'Submitting...' : 'Send payment'}
        </button>
      </form>
    </div>
  )
}
