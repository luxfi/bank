package bank

import (
	"net/http"
	"strings"
	"time"

	"github.com/hanzoai/base/apis"
	"github.com/hanzoai/base/core"
	"github.com/luxfi/bank/collections"
)

// -----------------------------------------------------------------------------
// View shapes — the JSON contract consumed by the dash frontend.
// Amounts are always minor units; `decimals` tells the client how to format.
// -----------------------------------------------------------------------------

type accountView struct {
	ID         string         `json:"id"`
	EntityName string         `json:"entityName"`
	EntityType string         `json:"entityType"`
	Country    string         `json:"country"`
	Currency   string         `json:"currency"`
	Status     string         `json:"status"`
	KYCStatus  string         `json:"kycStatus"`
	IBAN       string         `json:"iban"` // set only for IBAN markets; "" for US
	Receiving  *receivingView `json:"receiving"`
}

// receivingView is the coordinates someone needs to pay the account by bank
// rail, shaped for the account's currency: US accounts settle by ABA routing +
// account number (the US issues no IBAN), IBAN markets by IBAN + BIC. Both
// carry a SWIFT/BIC for inbound international wires.
type receivingView struct {
	BankName      string `json:"bankName"`
	AccountHolder string `json:"accountHolder"`
	RoutingNumber string `json:"routingNumber,omitempty"`
	AccountNumber string `json:"accountNumber,omitempty"`
	AccountType   string `json:"accountType,omitempty"`
	IBAN          string `json:"iban,omitempty"`
	Swift         string `json:"swift,omitempty"`
	BankAddress   string `json:"bankAddress,omitempty"`
}

type balanceView struct {
	Currency  string  `json:"currency"`
	Available Minor   `json:"available"`
	Held      Minor   `json:"held"`
	Decimals  int     `json:"decimals"`
	Kind      string  `json:"kind"` // fiat | crypto
	ValueUSD  float64 `json:"valueUsd"`
}

type walletView struct {
	ID       string `json:"id"`
	Currency string `json:"currency"`
	Address  string `json:"address"`
	Network  string `json:"network"`
	Status   string `json:"status"`
}

type cardView struct {
	ID         string `json:"id"`
	HolderName string `json:"holderName"`
	Brand      string `json:"brand"`
	Type       string `json:"type"`
	Last4      string `json:"last4"`
	Display    string `json:"display"`
	ExpMonth   int    `json:"expMonth"`
	ExpYear    int    `json:"expYear"`
	Currency   string `json:"currency"`
	Status     string `json:"status"`
	Design     string `json:"design"`
}

type txView struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	Direction string `json:"direction"`
	Amount    Minor  `json:"amount"`
	Currency  string `json:"currency"`
	Decimals  int    `json:"decimals"`
	Status    string `json:"status"`
	Reference string `json:"reference"`
	TxHash    string `json:"txHash,omitempty"`
	Network   string `json:"network,omitempty"`
	Created   string `json:"created"`
}

// -----------------------------------------------------------------------------
// View builders
// -----------------------------------------------------------------------------

func viewAccount(acct *core.Record) accountView {
	// nil where no rail has issued any: the account is still an account, it
	// just has nowhere for a wire to land yet.
	rec := receivingFor(acct)
	var iban string
	if rec != nil {
		iban = rec.IBAN
	}
	return accountView{
		ID: acct.Id, EntityName: acct.GetString("entityName"),
		EntityType: acct.GetString("entityType"), Country: acct.GetString("country"),
		Currency: acct.GetString("currency"), Status: acct.GetString("status"),
		KYCStatus: acct.GetString("kycStatus"), IBAN: iban, Receiving: rec,
	}
}

func viewBalances(app core.App, accountID string) []balanceView {
	recs, _ := app.FindRecordsByFilter(collections.BalanceCollectionName,
		"account = {:a}", "currency", 0, 0, map[string]any{"a": accountID})
	out := make([]balanceView, 0, len(recs))
	for _, b := range recs {
		cur := b.GetString("currency")
		avail := money[Minor](b, "available")
		kind := "fiat"
		if isCrypto(cur) {
			kind = "crypto"
		}
		out = append(out, balanceView{
			Currency: cur, Available: avail,
			Held:     money[Minor](b, "held"),
			Decimals: decimalsFor(cur), Kind: kind,
			ValueUSD: minorToUSD(avail, cur),
		})
	}
	return out
}

// viewWallets returns one wallet per crypto asset, each with its own
// chain-derived deposit address (BTC is bech32, EVM assets are 0x). Ordered by
// SupportedCrypto so the receive UI is stable.
func viewWallets(app core.App, accountID string) []walletView {
	recs, _ := app.FindRecordsByFilter(collections.WalletCollectionName,
		"account = {:a}", "currency", 0, 0, map[string]any{"a": accountID})
	byCur := make(map[string]walletView, len(recs))
	for _, w := range recs {
		byCur[w.GetString("currency")] = walletView{
			ID: w.Id, Currency: w.GetString("currency"), Address: w.GetString("address"),
			Network: w.GetString("network"), Status: w.GetString("status"),
		}
	}
	out := make([]walletView, 0, len(byCur))
	for _, asset := range SupportedCrypto {
		if v, ok := byCur[asset]; ok {
			out = append(out, v)
		}
	}
	return out
}

// viewWallet returns the primary wallet (first supported asset) for the
// single-wallet views. Nil when the account has no wallet.
func viewWallet(app core.App, accountID string) *walletView {
	ws := viewWallets(app, accountID)
	if len(ws) == 0 {
		return nil
	}
	return &ws[0]
}

func viewCards(app core.App, accountID string) []cardView {
	recs, _ := app.FindRecordsByFilter(collections.CardCollectionName,
		"account = {:a}", "-created", 0, 0, map[string]any{"a": accountID})
	out := make([]cardView, 0, len(recs))
	for _, c := range recs {
		out = append(out, viewCard(c))
	}
	return out
}

func viewCard(c *core.Record) cardView {
	return cardView{
		ID: c.Id, HolderName: c.GetString("holderName"), Brand: c.GetString("brand"),
		Type: c.GetString("type"), Last4: c.GetString("last4"), Display: c.GetString("display"),
		ExpMonth: int(c.GetFloat("expMonth")), ExpYear: int(c.GetFloat("expYear")),
		Currency: c.GetString("currency"), Status: c.GetString("status"), Design: c.GetString("design"),
	}
}

func viewTxns(app core.App, accountID string, limit int) []txView {
	recs, _ := app.FindRecordsByFilter(collections.TransactionCollectionName,
		"account = {:a}", "-created", limit, 0, map[string]any{"a": accountID})
	out := make([]txView, 0, len(recs))
	for _, t := range recs {
		cur := t.GetString("currency")
		var meta struct {
			TxHash  string `json:"txHash"`
			Network string `json:"network"`
		}
		_ = t.UnmarshalJSONField("metadata", &meta)
		out = append(out, txView{
			ID: t.Id, Type: t.GetString("type"), Direction: t.GetString("direction"),
			Amount:   money[Minor](t, "amount"),
			Currency: cur, Decimals: decimalsFor(cur), Status: t.GetString("status"),
			Reference: t.GetString("reference"), TxHash: meta.TxHash, Network: meta.Network,
			Created: t.GetString("created"),
		})
	}
	return out
}

// requireAccount resolves the caller's primary account.
//
// In sandbox it OPENS one on first sight instead of refusing. The demo account
// cannot be seeded at boot any more: its owner is IAM's subject, and this process
// does not know that value until somebody signs in. So the first authenticated
// request claims it, and the account belongs to whoever IAM actually
// authenticated rather than to a local identity that could never log in.
//
// A live deployment still refuses: an account is opened by onboarding, which
// takes a KYC body, and inventing one for whoever appears is the opposite of
// that.
func requireAccount(app core.App, e *core.RequestEvent) (*core.Record, error) {
	if acct := primaryAccount(app, e.Auth.Id); acct != nil {
		return acct, nil
	}
	if !Sandbox() {
		return nil, apis.NewNotFoundError("no account — complete onboarding first", nil)
	}

	acct, err := ProvisionCustomer(app, e.Auth, KYC{
		Name: "Lux Demo", Country: "US", EntityType: "individual",
		DOB: "1990-01-01", AddressLine: "1 Market St", City: "San Francisco", PostalCode: "94105",
	})
	if err != nil {
		app.Logger().Warn("sandbox: could not open the demo account", "owner", e.Auth.Id, "err", err)
		return nil, apis.NewNotFoundError("no account — complete onboarding first", nil)
	}
	return acct, nil
}

// -----------------------------------------------------------------------------
// Handlers
// -----------------------------------------------------------------------------

// handleOnboard provisions (or returns) the caller's account. Accepts an
// optional sandbox KYC body; auto-approves and funds the account in sandbox.
func handleOnboard(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		kyc, _ := bindBody[KYC](e) // body is optional
		acct, err := ProvisionCustomer(app, e.Auth, kyc)
		if err != nil {
			return apis.NewBadRequestError("failed to open account", err)
		}
		return e.JSON(http.StatusOK, buildOverview(app, acct))
	}
}

// handleOverview returns everything the dashboard needs in one call.
func handleOverview(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		// Overview is the first call the shell makes, so in sandbox it is where
		// the demo account gets opened: requireAccount provisions on first sight
		// because the owner is IAM's subject and nothing knows that until someone
		// signs in. Reporting onboarded:false here instead left the shell in its
		// pre-onboarding state — no nav, nothing to click — for a customer who
		// had just signed in successfully.
		acct, err := requireAccount(app, e)
		if err != nil {
			return e.JSON(http.StatusOK, map[string]any{"sandbox": Sandbox(), "onboarded": false})
		}
		return e.JSON(http.StatusOK, buildOverview(app, acct))
	}
}

// handleListTransactions returns the caller's full activity feed.
func handleListTransactions(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		return e.JSON(http.StatusOK, viewTxns(app, acct.Id, 200))
	}
}

func buildOverview(app core.App, acct *core.Record) map[string]any {
	return map[string]any{
		"sandbox":            Sandbox(),
		"onboarded":          true,
		"account":            viewAccount(acct),
		"balances":           viewBalances(app, acct.Id),
		"wallet":             viewWallet(app, acct.Id),
		"wallets":            viewWallets(app, acct.Id),
		"cards":              viewCards(app, acct.Id),
		"earn":               viewEarnSummary(app, acct.Id),
		"recentTransactions": viewTxns(app, acct.Id, 8),
	}
}

// -- Beneficiaries --

type beneficiaryReq struct {
	Name              string `json:"name"`
	BankAccountHolder string `json:"bankAccountHolder"`
	Currency          string `json:"currency"`
	Country           string `json:"country"`
	IBAN              string `json:"iban"`
	BIC               string `json:"bic"`
	AccountNumber     string `json:"accountNumber"`
	SortCode          string `json:"sortCode"`
	PaymentType       string `json:"paymentType"`
}

func handleListBeneficiaries(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		recs, _ := app.FindRecordsByFilter(collections.BeneficiaryCollectionName,
			"account = {:a}", "-created", 0, 0, map[string]any{"a": acct.Id})
		out := make([]map[string]any, 0, len(recs))
		for _, b := range recs {
			out = append(out, map[string]any{
				"id": b.Id, "name": b.GetString("name"),
				"bankAccountHolder": b.GetString("bankAccountHolder"),
				"currency":          b.GetString("currency"), "country": b.GetString("country"),
				"paymentType": b.GetString("paymentType"), "bankDetails": b.Get("bankDetails"),
				"verified": b.GetBool("verified"),
			})
		}
		return e.JSON(http.StatusOK, out)
	}
}

func handleCreateBeneficiary(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		req, err := bindBody[beneficiaryReq](e)
		if err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		if req.Name == "" || req.Currency == "" {
			return apis.NewBadRequestError("name and currency are required", nil)
		}
		if req.BankAccountHolder == "" {
			req.BankAccountHolder = req.Name
		}
		if req.Country == "" {
			req.Country = "US"
		}
		if req.PaymentType == "" {
			req.PaymentType = "regular"
		}
		col, err := app.FindCollectionByNameOrId(collections.BeneficiaryCollectionName)
		if err != nil {
			return apis.NewInternalServerError("", err)
		}
		rec := core.NewRecord(col)
		rec.Set("account", acct.Id)
		rec.Set("name", req.Name)
		rec.Set("bankAccountHolder", req.BankAccountHolder)
		rec.Set("currency", strings.ToUpper(req.Currency))
		rec.Set("country", strings.ToUpper(req.Country))
		rec.Set("paymentType", req.PaymentType)
		rec.Set("bankDetails", map[string]any{
			"iban": req.IBAN, "bic": req.BIC,
			"accountNumber": req.AccountNumber, "sortCode": req.SortCode,
		})
		rec.Set("verified", true) // sandbox auto-verifies
		if err := app.Save(rec); err != nil {
			return apis.NewBadRequestError(err.Error(), nil)
		}
		return e.JSON(http.StatusCreated, map[string]any{"id": rec.Id})
	}
}

func handleDeleteBeneficiary(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		rec, err := app.FindRecordById(collections.BeneficiaryCollectionName, e.Request.PathValue("id"))
		if err != nil {
			return apis.NewNotFoundError("beneficiary not found", nil)
		}
		if rec.GetString("account") != acct.Id {
			return apis.NewForbiddenError("not your beneficiary", nil)
		}
		if err := app.Delete(rec); err != nil {
			return apis.NewInternalServerError("", err)
		}
		return e.JSON(http.StatusOK, map[string]any{"deleted": rec.Id})
	}
}

// -- Cards --

func handleListCards(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		return e.JSON(http.StatusOK, viewCards(app, acct.Id))
	}
}

func handleIssueCard(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		body, _ := bindBody[struct {
			Currency string `json:"currency"`
		}](e)
		currency := strings.ToUpper(body.Currency)
		if currency == "" {
			currency = acct.GetString("currency")
		}
		// The card this issues is a simulation: its number is the BIN
		// 4242424242 — the test card every payment processor publishes —
		// with four random digits, and its CVV is three more, generated
		// fresh on each call and belonging to nothing. Handing that to a
		// customer as their card is the bank claiming to have issued one.
		//
		// A deployment that has declared itself real reaches its issuer at
		// /v1/bank/cards/virtual, which is provider-backed. Saying so is more
		// use than a card that will decline everywhere.
		if !Sandbox() {
			return errJSON(e, http.StatusNotImplemented,
				"card issuance is not available here; use /v1/bank/cards/virtual")
		}

		card := issueCardRecord(app, acct.Id, acct.GetString("entityName"), currency)
		if card == nil {
			return apis.NewInternalServerError("card issue failed", nil)
		}
		// CVV and full PAN are surfaced once here and never stored — only the
		// masked display and last4 persist on the card record.
		return e.JSON(http.StatusCreated, map[string]any{
			"card": viewCard(card),
			"cvv":  randDigits(3),
			"pan":  sandboxPAN(card.GetString("last4")),
		})
	}
}

func setCardStatus(app core.App, status string) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		card, err := app.FindRecordById(collections.CardCollectionName, e.Request.PathValue("id"))
		if err != nil {
			return apis.NewNotFoundError("card not found", nil)
		}
		if card.GetString("account") != acct.Id {
			return apis.NewForbiddenError("not your card", nil)
		}
		card.Set("status", status)
		if err := app.Save(card); err != nil {
			return apis.NewInternalServerError("", err)
		}
		writeAudit(app, acct.Id, e.Auth.Id, "card_"+status, map[string]any{"cardId": card.Id})
		return e.JSON(http.StatusOK, viewCard(card))
	}
}

// writeAudit mirrors the hooks helper but stays in package bank so card/route
// handlers can record compliance events without importing hooks.
func writeAudit(app core.App, accountID, actor, action string, detail map[string]any) {
	col, err := app.FindCollectionByNameOrId(collections.AuditCollectionName)
	if err != nil {
		return
	}
	rec := core.NewRecord(col)
	rec.Set("account", accountID)
	rec.Set("actor", actor)
	rec.Set("action", action)
	rec.Set("detail", detail)
	_ = app.Save(rec)
}

// -- Exchange (fiat FX + crypto buy/sell/convert, unified) --

type exchangeReq struct {
	FromCurrency string `json:"fromCurrency"`
	ToCurrency   string `json:"toCurrency"`
	Amount       Minor  `json:"amount"` // minor units of FromCurrency
}

func supportedAsset(cur string) bool {
	cur = strings.ToUpper(cur)
	if isCrypto(cur) {
		return true
	}
	_, ok := perUSD[cur]
	return ok
}

func handleCryptoPrices(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		type p struct {
			Asset    string  `json:"asset"`
			USD      float64 `json:"usd"`
			Decimals int     `json:"decimals"`
		}
		out := make([]p, 0, len(SupportedCrypto))
		for _, a := range SupportedCrypto {
			out = append(out, p{Asset: a, USD: cryptoUSD[a], Decimals: cryptoDecimals})
		}
		return e.JSON(http.StatusOK, map[string]any{"prices": out, "sandbox": Sandbox()})
	}
}

func handleExchangeQuote(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		req, err := bindBody[exchangeReq](e)
		if err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		from, to := strings.ToUpper(req.FromCurrency), strings.ToUpper(req.ToCurrency)
		if !supportedAsset(from) || !supportedAsset(to) || from == to || req.Amount <= 0 {
			return apis.NewBadRequestError("invalid currency pair or amount", nil)
		}
		toMinor, rate, err := exchangeRate(e.Request.Context(), from, to, req.Amount)
		if err != nil {
			return errJSON(e, http.StatusServiceUnavailable, "exchange unavailable")
		}
		return e.JSON(http.StatusOK, map[string]any{
			"fromCurrency": from, "toCurrency": to,
			"fromAmount": req.Amount, "toAmount": toMinor,
			"fromDecimals": decimalsFor(from), "toDecimals": decimalsFor(to),
			"rate": rate, "expiresAt": time.Now().Add(60 * time.Second).UTC().Format(time.RFC3339),
			"sandbox": Sandbox(),
		})
	}
}

func handleExchangeExecute(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		req, err := bindBody[exchangeReq](e)
		if err != nil {
			return apis.NewBadRequestError("invalid payload", err)
		}
		from, to := strings.ToUpper(req.FromCurrency), strings.ToUpper(req.ToCurrency)
		if !supportedAsset(from) || !supportedAsset(to) || from == to || req.Amount <= 0 {
			return apis.NewBadRequestError("invalid currency pair or amount", nil)
		}
		toMinor, rate, err := exchangeRate(e.Request.Context(), from, to, req.Amount)
		if err != nil {
			return errJSON(e, http.StatusServiceUnavailable, "exchange unavailable")
		}
		ref := "Exchange " + from + " → " + to

		// A conversion is one act with two legs, and the sold leg was settled
		// before the bought leg existed — so anything refusing the credit left
		// the customer's money spent and nothing bought, with a completed
		// transaction the stale sweep will never revisit. Either both legs land
		// or neither does.
		//
		// Nesting is safe as long as everything inside uses the callback's app,
		// so the balance hooks join this transaction rather than opening their
		// own.
		var debit, credit *core.Record
		var unsettled error
		leg := func(txApp core.App, dir, cur string, amount Minor) (*core.Record, error) {
			return newTx(txApp, map[string]any{
				"account": acct.Id, "type": "conversion", "direction": dir,
				"amount": amount, "currency": cur, "status": "pending",
				"sellCurrency": from, "buyCurrency": to,
				"sellAmount": req.Amount, "buyAmount": toMinor, "exchangeRate": rate,
				"reference": ref,
			})
		}
		if err := app.RunInTransaction(func(txApp core.App) error {
			var err error
			if debit, err = leg(txApp, "debit", from, req.Amount); err != nil {
				return err
			}
			if credit, err = leg(txApp, "credit", to, toMinor); err != nil {
				return err
			}
			for _, r := range []*core.Record{debit, credit} {
				if err := settle(txApp, r); err != nil {
					unsettled = err
					return err
				}
			}
			return nil
		}); err != nil {
			if unsettled != nil {
				return apis.NewInternalServerError("settlement failed", unsettled)
			}
			return errJSON(e, http.StatusUnprocessableEntity, err.Error())
		}
		return e.JSON(http.StatusOK, map[string]any{
			"fromCurrency": from, "toCurrency": to,
			"fromAmount": req.Amount, "toAmount": toMinor, "rate": rate,
			"balances": viewBalances(app, acct.Id),
		})
	}
}

func handleGetWallet(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		acct, err := requireAccount(app, e)
		if err != nil {
			return err
		}
		wallets := viewWallets(app, acct.Id)
		if len(wallets) == 0 {
			return apis.NewNotFoundError("no wallet", nil)
		}
		// Crypto holdings only.
		all := viewBalances(app, acct.Id)
		holdings := make([]balanceView, 0)
		for _, b := range all {
			if b.Kind == "crypto" {
				holdings = append(holdings, b)
			}
		}
		// `contracts` is what makes the address list honest on a real chain: the
		// wallet rows there all carry the same address, because an account has
		// one, and what actually distinguishes the assets is the token contract
		// each lives at. An empty contract means the chain's own coin.
		return e.JSON(http.StatusOK, map[string]any{
			"wallet": &wallets[0], "wallets": wallets, "holdings": holdings,
			"contracts": chain().Assets(),
			"network":   chain().Network(), "sandbox": Sandbox(),
		})
	}
}
