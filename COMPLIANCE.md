# Compliance — custody and conduct posture

A control document for `bankd` and the `lux.finance` dashboard. It records where
the signing keys are, what the SEC staff's 2026-04-13 statement on Covered User
Interface Providers does and does not reach here, what product copy was changed
and why, and what is still open.

Written by an engineer from the source. It is not legal advice, and the sections
marked **LEGAL** are questions for counsel, deliberately left unanswered.

---

## Where the keys are

**The bank holds every signing key on this surface. The customer holds none.**
There is no exception on any screen, and no path in the product where a customer
signs anything themselves.

The chain of derivation, end to end:

- `chainSeed` (`provision.go:122`) assigns each account a `chainIndex`, stored on
  the account record and never reused. Index 0 is reserved for the bank's own
  treasury; customers start at 1.
- `evmChain.key` (`evmchain.go:342`) turns that index into a private key by
  calling `derive(customer, index)`.
- `derive` (`evmchain.go:372`) walks `m/9000'/<networkId>'/<envId>'/<branch>'/<index>'`
  from a BIP-32 master built out of `BANK_CHAIN_MNEMONIC` — in production, the
  `providers/<org>/deploy-mnemonic` secret in KMS — and caches the resulting
  `*ecdsa.PrivateKey` in the process.
- Branch 0 is the customer, branch 1 the treasury (`evmchain.go:366`). The
  treasury funds customers' gas (`fund`, `evmchain.go:480`).

Two consequences worth stating plainly:

**One seed controls every customer key.** Compromise of the deploy mnemonic is
simultaneous compromise of every account's on-chain holdings. The hardening in
`derive` (every path step hardened, so an exported child key plus the parent xpub
cannot be run backwards to recover siblings) protects against key *export*, not
against seed compromise.

**No client-side signing exists.** `app/dash` contains no `wagmi`, `viem`,
`ethers`, WalletConnect, RainbowKit or `window.ethereum` reference. There is no
connect-wallet path to find, partial or otherwise. Verified by search across
`app/dash/src` and `package.json`.

### Per screen, per action

| Screen | Action | Endpoint | Who signs | Moves on chain |
|---|---|---|---|---|
| Dashboard | View balances, Earn summary, cards | `GET /v1/bank/overview` | — | No |
| Wallet | View holdings and address | `GET /v1/bank/wallet` | — | No |
| Wallet | **Send crypto** | `POST /v1/bank/crypto/send` | **Bank**, customer-branch key | Yes, when `BANK_CHAIN_RPC` is set |
| Wallet | Receive / faucet (sandbox only) | `POST /v1/bank/crypto/deposit` | — | No — ledger credit |
| Wallet | Buy / Sell / Convert tiles | → Exchange | — | No |
| Exchange | Quote | `POST /v1/bank/exchange/quote` | — | No |
| Exchange | Execute | `POST /v1/bank/exchange/execute` | — | **No — internal ledger book entry** |
| Earn | **Deposit / Borrow / Repay / Withdraw** | `POST /v1/bank/earn/*` | **Bank**, customer-branch key | Yes when the chain carries a market; ledger-only otherwise |
| Send | Outbound payment | `POST /v1/bank/payments/outbound` | — | No — fiat rails |
| Send | Internal transfer | `POST /v1/bank/transfers` | — | No |
| Send | Crypto receive addresses | `GET /v1/bank/overview` | — | Addresses shown are bank-controlled |
| Cards | Issue / freeze / unfreeze | `POST /v1/bank/cards*` | — | No — issuer API |
| Activity | View | `GET /v1/bank/transactions` | — | No |
| Accounts | View balances, wallets, history | `GET /v1/bank/accounts/{id}/*` | — | No |

Only two handlers reach a chain key: `handleCryptoSend` (`crypto.go:186`) and
`earnOnChain` (`liquid.go:315`). Both pass `chainSeed(app, acct)` into a backend
that derives and signs.

### Things the map makes visible

**Exchange never touches a chain.** A LUX→USD conversion is an internal ledger
entry priced by forexd, with Kraken as the default spot backend
(`exchange.go:29`). The customer sees an asset swap; no token moves. That is a
custody fact and also a routing fact — see the open questions.

**The sandbox fabricates receipts.** `simChain.Send` (`chain.go:107`) returns a
random hash and broadcasts nothing. In sandbox a customer sees a transaction hash
for a transfer that never happened. This is correct for a demo and is flagged by
the sandbox badge, but it is a receipt for a non-event and should never be
reachable in a live mode. The guard is in place: `handleCryptoSend` refuses when
the backend is not a live `evmChain` and the process is not in sandbox
(`crypto.go:153`), and a configured-but-unreachable chain resolves to `offChain`,
which fails every operation rather than degrading into the simulation.

**The Earn deposit path takes custody of an intermediate form.** For a vault
whose collateral is the chain's own coin, `evmMarket.wrap` / `unwrap`
(`evmmarket.go:253`, `:284`) wraps and unwraps on the customer's behalf using the
customer-branch key. Another movement the bank makes, not the customer.

---

## What the statement covers here

**Nothing.**

The 2026-04-13 Division of Trading and Markets statement conditions its
non-objection on the interface being **self-custodial** — neither the interface
nor the wallet provider having custody of, or access to, the user's private key.
On this surface the operator has both: it derives the key, stores the seed, and
signs with it.

So the relief does not reach the Wallet send flow, and it does not reach any of
the four Earn movements. It does not reach anything else either, because nothing
else touches a chain.

**No disclosure changes this.** The condition is a fact about who holds the key,
not about what the customer was told. The copy changes below exist so the product
stops implying the opposite of the truth — they do not move a single flow inside
the relief, and nothing in this repo should be written or read as if they do.

Also worth keeping in front of counsel: the statement is a **staff** statement of
non-objection from one Division. It is not a Commission rule, it does not bind
the Commission, and it does not bind private litigants or state regulators. It
addresses broker-dealer registration and speaks to nothing else — not exchange or
ATS registration, not the Advisers Act, not state money transmission, not the
CEA.

---

## Copy that changed

Everything below was a claim the product could not support, an outcome stated as
certain, or a recommendation to put money somewhere. APYs, TVL, LTV and rate
figures were left alone — those are facts.

Line numbers in the "Where" column locate the string *before* the change, so the
tables can be read against the previous revision. References in **Gaps not
closed** are current.

### Custody misstatements — the material ones

| Where | Was | Now |
|---|---|---|
| `Landing.tsx:21` | "Every account ships with a **non-custodial** wallet secured by threshold MPC — no single key." | "Every account ships with a crypto wallet. We hold its key and sign on your instruction — the same custody as your cash balances." |
| `Landing.tsx:23` | "Collateralize crypto in **non-custodial vaults** and borrow against it while yield repays you." | "Deposit crypto collateral into a Liquid vault and borrow the vault's synthetic against it, up to its LTV. Collateral yield is applied to the debt. We hold the key and sign each movement." |
| `Wallet.tsx:122` | "Testnet assets only. In production this wallet is secured by threshold MPC — no single key." | Deleted. Replaced by the custody note beside the actions. |

The two `non-custodial` claims were the most serious thing found. They used the
exact term the relief is defined around, to describe a product that is the
opposite. The threshold-MPC claim was false twice over: it described custody the
customer does not have, and it described a mechanism that does not exist — the
implementation derives one ordinary ECDSA key per account from one seed.

### Custody disclosure added

A single component, `app/dash/src/components/Custody.tsx`, states one fact and is
placed where the customer meets the action rather than in a footer. It names the
operator from the brand, so a white-label surface does not attribute custody to
the wrong entity.

> {Operator} holds the key to {subject} and signs on your instruction. You do not
> hold a key, and cannot move these assets without us.

Placed at:

- `Wallet.tsx` — under the action tiles, directly above the send and receive panels.
- `Earn.tsx` — under the page header, and again inside the vault modal, because
  the modal covers the page and the page-level note is not on screen at the
  moment a movement is committed.
- `Landing.tsx` — in the Liquid section, before the mechanics, with the added
  line "Liquid is reached through your account, not through a wallet you
  connect." A reader who knows DeFi will otherwise assume they sign.

The wording is mechanical on purpose. It says who signs, which is checkable
against the code, and claims nothing about how the key is protected — that was
the failure mode of the line it replaces.

### Outcome stated as certain

| Where | Was | Now |
|---|---|---|
| `Landing.tsx:288` | "Your collateral pays the loan back." | "The yield on your collateral goes to the debt." |
| `Landing.tsx:291` | "The yield clears the debt." | "…the collateral's yield is applied to what you owe. How long that takes to clear the debt depends on the yield, which moves." |
| `Landing.tsx:211` | "keep earning **exactly as they did** outside it" | "keep accruing the yield they carry outside it" |
| `Landing.tsx:226` | "Fixed duration, **predictable redemption**." | "…over ninety days, as transmuter capacity allows." |
| `Landing.tsx:347` | "staking yield **clears the loan** behind you" | "staking yield **is applied to** the loan behind you" |
| `Landing.tsx:387` | "Yield is the only thing that moves it, and **it moves it your way**." | "It holds while the synthetic tracks its underlying — a property of how each vault is configured, not one the protocol enforces." |
| `Landing.tsx:453` | "so the loan **pays down whether or not you are watching**" | "the yield they return is applied to your debt. Nothing to schedule." |
| `Earn.tsx:59` | "borrow against yield-bearing collateral and **let the yield repay it**" | "…The collateral's yield is applied to the debt." |
| `Earn.tsx:246` | "**The yield pays it back.**" (on the borrow action) | "Collateral yield is applied to the debt." |
| `Earn.tsx:245` | "**It earns** 8.2%" | "It carries a 8.2% yield today" |
| `Earn.tsx:196` | "No debt — the yield accrues **to you**" | "No debt — the yield accrues to the position" |
| `Earn.tsx:195` | "**Self-repays** in 4 years at today's yield" | "**Clears** in 4 years at today's yield" |
| `Dashboard.tsx:133` | "**the yield repays it**" | "collateral yield is applied to the debt" |

### Risk characterised as a verdict

| Where | Was | Now |
|---|---|---|
| `Earn.tsx:226` | LTV meter reading `Safe` | `Within limit` |
| `Landing.tsx:379` | "what makes 90% a **safe ceiling rather than a reckless one**" | "what a 90% ceiling rests on — arithmetic, not a view about where the market goes" |
| `Landing.tsx:373` | "the ratio between them **does not change**" | "the ratio between them is unchanged **by price alone**" |
| `Earn.tsx:312` | "Left to borrow" rendered in the positive/green token | Neutral. Headroom is capacity to take on debt, not a gain. |

The like-kind argument itself is sound and stays — it is the most interesting
true thing on the page. What it was missing is that the invariant is a property
of how each vault is *configured at deploy*, not something `Liquid` enforces: the
protocol takes three unrelated token addresses and trusts the adapter, so a
dollar-denominated debt against volatile collateral is constructible with the
same contracts. The page now says so.

### Absolute claims about liquidity and redemption

| Where | Was | Now |
|---|---|---|
| `Landing.tsx:216` | "It moves and spends **like any other token you hold**." | "It is an ERC-20 and transfers like one." |
| `Landing.tsx:428` | "each one **redeemable for its own underlying**" | "…redeemable for its own underlying **through that vault's transmuter**" |
| `Landing.tsx:443` | "tradeable **on any marketplace**" | "tradeable **wherever the standard is supported**" |

### Execution quality and discretion

| Where | Was | Now |
|---|---|---|
| `Landing.tsx:20` | "conversion at **institutional rates — no hidden spread**" | "Every conversion is quoted, spread included, before you confirm it." |
| `Landing.tsx:221` | "Mix-Yield Token strategies **spread your collateral's yield across protocols and put all of it** against what you owe" | "…allocate the collateral across the protocols **that vault names**, and the yield they return is applied to what you owe" |
| `Landing.tsx:452` | "Yield **is allocated across these and routed to** your debt" | "**Each vault names the strategies it allocates to**, and the yield they return is applied to your debt" |
| `Exchange.tsx:176` | "Settles **instantly**." | "Conversions settle immediately **in the sandbox**." |
| `Landing.tsx:112` | "convert **instantly**, spend **anywhere**" | "convert between currencies, spend on card" |
| `Landing.tsx:24` | Title "**Bank-grade** security" | Title "Sign-in and screening" — the body already lists the actual controls |

"No hidden spread" was also contradicted by the product: the Exchange screen
states a 0.2% spread in the sandbox, and `feeSchedule` carries a 25bp conversion
spread in production.

The two Mix-Yield changes matter beyond wording. "We spread your yield across
protocols" describes the operator exercising discretion over third-party venues
on the customer's behalf. Pointing at the set each vault publishes describes a
disclosed, non-discretionary allocation. The copy now matches the second, which
is what the code does — but see the open questions, because who curates that set
is still us.

### Recommendation to acquire a specific asset

| Where | Was | Now |
|---|---|---|
| `Wallet.tsx:103` | "Buy LUX, BTC, ETH or DAI to fund your wallet." | "Convert from a cash balance, or receive to your deposit address." |
| `Wallet.tsx:104` | CTA "Buy crypto" → `/app/exchange?from=USD&to=LUX` | CTA "Open exchange" → `/app/exchange` |

The empty state named four assets and pre-selected the house token in the link.
That is a recommendation to acquire a particular instrument, issued by the party
that issues it.

---

## Gaps not closed

Blunt list. None of these were fixed, and each is a real finding.

**Vault descriptions still carry advice-flavoured copy, and they render on two
screens.** They live in Go (`collections/vaults.go`) and were outside the edit
scope for this pass. They reach the customer through `Landing.tsx` and
`Earn.tsx` as `{vault.description}`:

- `vaults.go:29` — "Stake LUX for network yield and borrow xLUX against it.
  **Staking rewards repay the loan.**"
- `vaults.go:34` — "Deposit ETH as wstETH and borrow xETH. **Ethereum staking
  yield flows to your debt.**"
- `vaults.go:44` — "**Earn** the DAI savings rate and borrow xUSD **without
  selling your DAI**."

All three state repayment or yield as certain, in the same voice the dashboard
copy just stopped using. They should be brought into line before this ships.

**The landing page advertises tokens the API does not serve.** `Landing.tsx`
lists six debt tokens (`xLUX`, `xETH`, `xUSD`, `xZOO`, `xAI`, `xPARS`) as a
static array. The served catalog has four vaults carrying three distinct
synthetics (`xLUX`, `xETH`, `xUSD`). `xZOO`, `xAI` and `xPARS` do not exist in
anything `bankd` returns. A marketing surface naming instruments the platform
does not offer is a straightforward accuracy problem independent of any
securities question.

**Wallet rows are hardcoded "Testnet".** `Wallet.tsx` labels every holding
`note="Testnet"` regardless of the network the backend reports. On mainnet this
mislabels real assets. The page subtitle already carries the true network from
`networkName()`; the row note does not.

**Wallet action tiles pre-select pairs.** Buy / Sell / Convert hardcode
`USD→LUX`, `LUX→USD`, `LUX→DAI`. Neutral verbs, but the house token is
pre-chosen in all three. Left alone because changing tile behaviour is a product
decision, not a copy fix.

**Every balance row is one click from a pre-filled trade.** `AssetRow` in
`components/ui.tsx` links each holding into `/app/exchange` with a counter-currency
already selected. Outside the edit scope for this pass.

**The membership ladder visually picks a tier.** `Landing.tsx` gives the `black`
plan the only accent border and the only primary button; every other tier gets a
secondary. A recommendation made in CSS rather than copy. Probably fine as
commerce, noted because the same reasoning that catches "our pick" in text
catches it here.

**Exchange routes to one venue with no disclosure.** `forexProvider()` defaults
to Kraken and the customer is never shown where a conversion was priced or
filled. The quote shows a rate; it does not show a route.

---

## Open questions — LEGAL, not engineering

These are counsel's. I am an engineer and none of them is mine to answer. Listed
in roughly the order they gate each other.

**Are the vault synthetics crypto asset securities at all?** `xLUX`, `xETH`,
`xUSD` — and `xZOO`, `xAI`, `xPARS` if those are ever issued. This determination
changes which rules apply to nearly everything above, and it is the gate on most
of the rest of this list. **Raised here, deliberately not answered.**

**Is the Liquid position itself an offer of a security?** A position is an NFT
carrying collateral and debt together, transferable, with a yield stream attached.
Whether that is an investment contract is a separate question from what the
synthetic is.

**Does operating a custodial crypto wallet and originating collateralised loans
constitute broker-dealer or dealer activity independent of the statement?** The
relief being unavailable is not the same as the activity requiring registration;
both need answering, separately.

**Does the position NFT's transferability create a secondary market the operator
facilitates?** The product markets them as tradeable. Whether pointing at that
tradability, from an interface the operator runs, has exchange or ATS
implications.

**What custody regime applies to customer crypto held under one operator seed?**
Exchange Act Rule 15c3-3, state trust and custody requirements, or neither. The
single-seed structure is the material fact: it is not segregated per customer in
any cryptographic sense, only in ledger accounting.

**State money transmission licensing** for the custodial crypto wallet and for
the fiat rails, across the states the product is offered in.

**Is Earn a lending product, a securities-based loan, or an offer of a security?**
The three have different rulebooks and the product currently reads as all three
depending on which screen you are on.

**Does marketing published vault APYs constitute an offer of an investment
contract**, and if so what disclosure attaches to the APY figures the catalog
serves.

**Does routing every conversion to a single undisclosed venue require
disclosure**, under securities rules or otherwise.

**Does "bank", "banking" and IBAN language on a non-bank surface raise
misbranding exposure** under state banking law. Separate from securities
entirely, but it is on the same screens.

---

## What a self-custodial path would require

The owner wants connect-wallet DeFi on this surface eventually. Nothing here was
built toward it. This is the shape of what would have to be true, so a reader can
act on it later.

The operative text is the statement itself, and counsel has to map each condition
to a specific surface. What follows is the engineering half.

**The key must never be derivable by us.** This is the whole condition, and it is
structural rather than procedural. A self-custodial flow cannot pass through
`chainSeed` or `evmChain.key` at any point. The interface builds an unsigned
transaction, hands it to the user's wallet over EIP-1193 or WalletConnect, and
the wallet signs. `bankd` must not hold, escrow, or be able to reconstruct that
key — and "we could derive it but we choose not to" fails the condition.

**Custody cannot be taken transiently either.** Today the deposit path wraps the
native coin on the customer's behalf (`evmMarket.wrap`). Any step where the asset
passes through an address we control is custody, however brief. In a
self-custodial flow the wrap is the user's wallet's transaction, not ours.

**Gas cannot be funded the way it is now.** The treasury tops customers up before
every transaction (`fund`, `evmchain.go:480`). Paying gas for a transaction the
user signs is at minimum a fee question and possibly an agency one. It needs a
different answer, and the answer needs to be one counsel has seen.

**The two models cannot be blended on one screen.** If some Earn actions are
custodial and some are not, a customer cannot tell which rules apply to the
button they are about to press — and neither can a regulator reading the
interface. Separate surfaces, or an unmissable separation within one.

**Route transparency.** The interface must disclose where a transaction goes.
Today `earnAction` resolves `chain().Market(v.Underlying)` from a deployment file
and the customer never sees the contract. A self-custodial flow has to surface
the destination — protocol, contract address, chain — per action, before signing.

**Fee agnosticism.** No fee or spread that varies with the route or venue chosen.
Earn currently carries no wire fee and no forex routing, which is a good starting
position; the constraint is on what gets added later.

**No discretion over venue.** We must not choose among protocols on the user's
behalf using judgment. The current vault catalog is curated by us
(`collections.Vaults`) and the market set comes from a deployment file we
control. Either the user selects, or the selection is non-discretionary against
published criteria and disclosed as such. The copy was changed to describe the
second; the code still does the first.

**Venue criteria.** Whatever protocols are offered have to be selected against
published, objective criteria applied consistently — not an editorial list.
Writing those criteria down is a prerequisite, not a follow-up.

**The five disclosures.** Counsel enumerates them from the statement text and
each gets mapped to a specific place in the flow. Not guessed at here; guessing
at the content of a condition is how a surface ends up claiming relief it does
not have.

**And the threshold question stays open regardless.** If the synthetics are not
crypto asset securities, the statement is not the relevant frame in the first
place. That determination comes before any of this work is worth starting.
