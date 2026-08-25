// @luxfi/bank-dash — the Lux Financial product surface.
//
// Two hosts render it: lux.finance, where it is the whole app, and the Lux
// Cloud console, where it sits beside a validator's nodes and keys. Both talk
// to the same bankd and the same Lux ID. Nothing here is reimplemented on
// either side; `configure` is how a host says where its bank is.
//
// The design system rides along: a host importing these screens gets the same
// grid, type and colour they have on lux.finance, without carrying the build
// plugin that compiles them.
import './main.css'

export { Finance, screens } from './Finance'
export { configure } from './api/client'
export { BrandProvider } from './hooks/brand'

export { Dashboard } from './pages/Dashboard'
export { Accounts } from './pages/Accounts'
export { Cards } from './pages/Cards'
export { Send } from './pages/Send'
export { Exchange } from './pages/Exchange'
export { Wallet } from './pages/Wallet'
export { Earn } from './pages/Earn'
export { Activity } from './pages/Activity'
