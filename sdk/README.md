# @luxfi/bank

Typed client for the Lux banking API (`/v1/bank`) — accounts, transfers,
payments, beneficiaries, cards, crypto, exchange, FX, and membership plans.
Sandbox and production serve the identical contract (LP-3040); point the
client at either.

```ts
import { Bank } from '@luxfi/bank'

const bank = new Bank({
  baseUrl: 'https://api.sandbox.lux.financial',
  token: () => sessionStorage.getItem('token'),
})

const plans = await bank.plans()
const { holdings } = await bank.wallet()
await bank.sendCrypto('ETH', 400_000, '0x1234…5678') // minor units, 6 dp

// Card issuance — branch only on the issuer's status/nextAction pair:
const { data } = await bank.cardAccount()
if (data.virtualAccount?.nextAction === 'complete_kyc') {
  const { url } = await bank.cardKYCURL() // sensitive — straight to the browser
  window.open(url)
}
```

Amounts are integers in minor units; every balance carries `decimals`
(2 for most fiat, 0 for JPY, 6 for crypto). Errors throw `BankError`
with `status` and the parsed body.

Docs: [docs.lux.financial](https://docs.lux.financial/docs/banking) ·
Spec: LP-3040.
