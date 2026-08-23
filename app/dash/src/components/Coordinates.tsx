import type { AccountView } from '@/api/client'
import { CopyRow, stack } from '@/components/ui'
import { View } from '@/gui'

// What someone needs in order to wire money in. Which lines those are is a
// property of the market, not of the screen: a US account is reached by routing
// number + account number, an IBAN market by its IBAN. Both name the bank, and
// both carry a SWIFT/BIC for money arriving from abroad.
//
// Every line is copyable because every line gets pasted into somebody's
// transfer form. An older bankd sends no `receiving` at all — then the account's
// own IBAN field is all there is, and the row says so.
export function Coordinates({ account }: { account: AccountView }) {
  const r = account.receiving
  if (!r) {
    return <CopyRow label="Account number (IBAN)" value={account.iban} empty="No IBAN on this account yet" />
  }
  return (
    <View className="sm:grid-cols-2" style={stack(16)}>
      <CopyRow label="Bank" value={r.bankName} mono={false} />
      <CopyRow label="Account holder" value={r.accountHolder} mono={false} />
      {r.routingNumber && <CopyRow label="Routing number (ABA)" value={r.routingNumber} />}
      {r.accountNumber && <CopyRow label="Account number" value={r.accountNumber} />}
      {r.accountType && <CopyRow label="Account type" value={r.accountType} mono={false} />}
      {r.iban && <CopyRow label="IBAN" value={r.iban} />}
      {r.swift && <CopyRow label="SWIFT / BIC" value={r.swift} />}
      {r.bankAddress && (
        <View className="sm:col-span-2" style={stack()}>
          <CopyRow label="Bank address" value={r.bankAddress} mono={false} />
        </View>
      )}
    </View>
  )
}
