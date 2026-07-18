import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { onboard, type KYC } from '@/api/client'
import { Wordmark } from '@/components/Brand'
import { Button, Icon, SandboxBadge } from '@/components/ui'

const COUNTRIES = [
  ['US', 'United States'], ['GB', 'United Kingdom'], ['DE', 'Germany'], ['FR', 'France'],
  ['SG', 'Singapore'], ['AE', 'United Arab Emirates'], ['CA', 'Canada'], ['AU', 'Australia'],
] as const

const STEPS = ['Identity', 'Address', 'Review'] as const

export function Onboarding({ onDone }: { onDone: () => Promise<void> }) {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Record<keyof KYC, string>>({
    name: (user?.name as string) || '',
    entityType: 'individual',
    dob: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'US',
  })
  const set = (k: keyof KYC, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const canNext =
    (step === 0 && form.name && form.dob) || (step === 1 && form.addressLine && form.city && form.country)

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      await onboard(form)
      await onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open your account')
      setSubmitting(false)
    }
  }

  return (
    <div className="app-ambience min-h-screen">
      <div className="relative z-10 max-w-lg mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-8">
          <Wordmark className="text-lg" />
          <SandboxBadge />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Open your account</h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">
            A few details and you’re in. Sandbox verification is instant — no documents needed.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full ${i <= step ? 'bg-[var(--color-fg)]' : 'bg-[var(--color-surface-3)]'}`} />
              <p className={`text-[0.7rem] mt-1.5 ${i === step ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-subtle)]'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="card p-6 rise">
          {step === 0 && (
            <div className="space-y-4">
              <Segmented
                value={form.entityType || 'individual'}
                onChange={(v) => set('entityType', v)}
                options={[['individual', 'Personal'], ['business', 'Business']]}
              />
              <Field label={form.entityType === 'business' ? 'Business name' : 'Full name'}>
                <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Anderson" />
              </Field>
              <Field label="Date of birth">
                <input className="input" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Address">
                <input className="input" value={form.addressLine} onChange={(e) => set('addressLine', e.target.value)} placeholder="1 Market Street" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City">
                  <input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="San Francisco" />
                </Field>
                <Field label="Postal code">
                  <input className="input" value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="94105" />
                </Field>
              </div>
              <Field label="Country">
                <select className="input" value={form.country} onChange={(e) => set('country', e.target.value)}>
                  {COUNTRIES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
                </select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Review label="Name" value={form.name} />
              <Review label="Type" value={form.entityType === 'business' ? 'Business' : 'Personal'} />
              <Review label="Date of birth" value={form.dob} />
              <Review label="Address" value={[form.addressLine, form.city, form.postalCode, form.country].filter(Boolean).join(', ')} />
              <div className="flex items-start gap-2 text-xs text-[var(--color-fg-subtle)] pt-2">
                <Icon name="shield" className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Sandbox environment — instant approval. In production this is a full KYC/AML review.</span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-[var(--color-negative)] mt-4">{error}</p>}

          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">Back</Button>
            )}
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button onClick={submit} loading={submitting} className="flex-1">Open account</Button>
            )}
          </div>
        </div>

        <p className="text-center text-[0.7rem] text-[var(--color-fg-subtle)] mt-6 max-w-sm mx-auto">
          Demo — banking services provided by our licensed BaaS partner. Sandbox environment, not for
          real deposits. Placeholder terms, pending counsel review.
        </p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="label">{label}</span>
      {children}
    </label>
  )
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-fg-subtle)]">{label}</span>
      <span className="font-medium text-right">{value || '—'}</span>
    </div>
  )
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[var(--color-surface-2)] border">
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`py-2 rounded-full text-sm font-medium transition-colors ${
            value === v ? 'bg-[var(--color-fg)] text-black' : 'text-[var(--color-fg-muted)]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
