import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate } from '@/lib/format'
import { useRecords } from '@/hooks/useRecords'

const docTypes = [
  'passport',
  'drivers_license',
  'national_id',
  'proof_of_address',
  'bank_statement',
  'incorporation_certificate',
  'tax_return',
  'other',
]

interface Document {
  id: string
  type: string
  filename: string
  status: string
  created: string
}

export function Documents() {
  const [docType, setDocType] = useState('passport')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, loading: listLoading, refetch } = useRecords<Document>({
    collection: 'documents',
    perPage: 50,
    sort: '-created',
  })

  const documents = data?.items || []

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  async function handleUpload() {
    if (!file) return
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Create a document record with the file via FormData.
      const form = new FormData()
      form.append('type', docType)
      form.append('filename', file.name)
      form.append('status', 'pending')
      form.append('file', file)

      const baseUrl = import.meta.env.VITE_BANK_API_URL || ''
      const token = sessionStorage.getItem('bank_token')
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${baseUrl}/v1/collections/documents/records`, {
        method: 'POST',
        headers,
        body: form,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `Upload failed: ${res.status}`)
      }

      setSuccess(`Uploaded ${file.name}`)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      refetch()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Documents</h1>

      {/* Upload form */}
      <div className="max-w-lg space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {success}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium">Document type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center text-sm transition-colors ${
            dragOver
              ? 'border-gray-500 bg-gray-100 dark:bg-gray-800'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          {file ? (
            <p className="font-medium">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Drop file here or click to select
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {loading ? 'Uploading...' : 'Upload document'}
        </button>
      </div>

      {/* Document list */}
      <div>
        <h2 className="mb-3 text-lg font-medium">Uploaded documents</h2>
        {listLoading && <p className="text-sm text-gray-500">Loading...</p>}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Filename</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3 capitalize">{d.type.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3">{d.filename}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(d.created)}</td>
                </tr>
              ))}
              {documents.length === 0 && !listLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No documents uploaded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
