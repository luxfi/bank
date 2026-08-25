import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { BrandProvider } from '@/hooks/brand'
import { Dashboard } from '@/pages/Dashboard'
import { Accounts } from '@/pages/Accounts'
import { Cards } from '@/pages/Cards'
import { Send } from '@/pages/Send'
import { Exchange } from '@/pages/Exchange'
import { Wallet } from '@/pages/Wallet'
import { Earn } from '@/pages/Earn'
import { Activity } from '@/pages/Activity'

// The finance product without a shell around it. lux.finance renders these
// screens inside its own layout; the Lux Cloud console renders them beside a
// validator's nodes, keys and safes, under its own navigation. Same screens,
// same bankd, same Lux ID — a token minted for any app in the org resolves to
// the same principal at IAM's userinfo, so the console's existing session
// already authorizes the bank and nobody signs in twice.
//
// The router comes along because the screens link to each other. It is scoped
// to `basename`, so a host routing by other means keeps everything outside
// that prefix to itself.
export function Finance({ basename }: { basename: string }) {
  return (
    <BrandProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="cards" element={<Cards />} />
          <Route path="send" element={<Send />} />
          <Route path="exchange" element={<Exchange />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="earn" element={<Earn />} />
          <Route path="activity" element={<Activity />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </BrowserRouter>
    </BrandProvider>
  )
}

// What the product is made of, in the order a customer meets it. A host that
// wants its own routing mounts these directly instead of <Finance/>; it owns
// the router then, and the screens' links resolve against it.
export const screens = [
  { path: '', label: 'Overview', element: Dashboard },
  { path: 'wallet', label: 'Wallet', element: Wallet },
  { path: 'earn', label: 'Earn', element: Earn },
  { path: 'send', label: 'Send', element: Send },
  { path: 'exchange', label: 'Exchange', element: Exchange },
  { path: 'cards', label: 'Cards', element: Cards },
  { path: 'activity', label: 'Activity', element: Activity },
  { path: 'accounts', label: 'Accounts', element: Accounts },
] as const
