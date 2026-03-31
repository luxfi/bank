import { useState, type FormEvent } from 'react'
import { useRecords } from '@/hooks/useRecords'
import { getFXQuote, executeFX } from '@/api/client'
import { formatAmount } from '@/lib/format'

interface Account {
  id: string
  entityName: string
  currency: string
}

interface Quote {
  sellCurrency: string
  buyCurrency: string
  sellAmount: number
  buyAmount: number
  rate: number
  quoteId: string
  expiresAt: string
}

export function Conversions() {
  const { data: accountsData } = useRecords<Account>({
    collection: 'accounts',
    perPage: 50,
    filter: 'status = "active"',
  })

  const [accountId, setAccountId] = useState('')
  const [sellCurrency, setSellCurrency] = useState('USD')
  const [buyCurrency, setBuyCurrency] = useState('EUR')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [executed, setExecuted] = useState(false)

  const accounts = accountsData?.items || []

  async function handleQuote(e: FormEvent) {
    e.preventDefault()
    setError('')
    setQuote(null)
    setExecuted(false)
    setLoading(true)

    const cents = Math.round(parseFloat(amount) * 100)
    if (isNaN(cents) || cents <= 0) {
      setError('Enter a valid amount')
      setLoading(false)
      return
    }

    try {
      const q = await getFXQuote({ sellCurrency, buyCurrency, amount: cents })
      setQuote(q)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quote failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleExecute() {
    if (!quote || !accountId) return
    setError('')
    setLoading(true)
    try {
      await executeFX({ accountId, quoteId: quote.quoteId })
      setExecuted(true)
      setQuote(null)
      setAmount('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">FX conversion</h1>

      <form
        onSubmit={handleQuote}
        className="max-w-lg space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}

        {executed && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Conversion executed successfully
          </p>
        )}

        <div>
          <label className="block text-sm font-medium">Account</label>
          <select
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Sell</label>
            <input
              type="text"
              required
              maxLength={3}
              value={sellCurrency}
              onChange={(e) => setSellCurrency(e.target.value.toUpperCase())}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Buy</label>
            <input
              type="text"
              required
              maxLength={3}
              value={buyCurrency}
              onChange={(e) => setBuyCurrency(e.target.value.toUpperCase())}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Amount ({sellCurrency})</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setQuote(null); setExecuted(false) }}
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !accountId}
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {loading && !quote ? 'Getting quote...' : 'Get quote'}
        </button>
      </form>

      {/* Quote preview */}
      {quote && (
        <div className="max-w-lg space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-medium">Quote</h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500 dark:text-gray-400">Sell:</span>{' '}
              {formatAmount(quote.sellAmount, quote.sellCurrency)}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">Buy:</span>{' '}
              {formatAmount(quote.buyAmount, quote.buyCurrency)}
            </p>
            <p>
              <span className="text-gray-500 dark:text-gray-400">Rate:</span> {quote.rate.toFixed(6)}
            </p>
            <p className="text-xs text-gray-400">Expires: {new Date(quote.expiresAt).toLocaleTimeString()}</p>
          </div>
          <button
            onClick={handleExecute}
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Executing...' : 'Execute conversion'}
          </button>
        </div>
      )}
    </div>
  )
}
