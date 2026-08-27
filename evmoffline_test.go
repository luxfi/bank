package bank

import (
	"crypto/ecdsa"
	"math/big"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"

	"github.com/luxfi/geth/accounts"
	"github.com/luxfi/geth/common"
	bip32 "github.com/luxfi/go-bip32"
	bip39 "github.com/luxfi/go-bip39"
)

// -----------------------------------------------------------------------------
// The chain backend does four things that never touch an RPC: it reads the
// deployment file, it reports what it carries, it validates a destination, and
// it turns an account index into an address. Those are covered here, so they
// hold in CI, where there is no chain. What genuinely needs a node — balances,
// sends, the borrow ceiling — stays in evmchain_test.go behind BANK_CHAIN_RPC.
// -----------------------------------------------------------------------------

// testMnemonic is Foundry's published development mnemonic. It is in their
// documentation and in every example, so it can never be an account anywhere
// real; the addresses it derives are deterministic, which is the point.
const testMnemonic = "test test test test test test test test test test test junk"

// offline builds the backend with no client. Every method below is one that
// never dials, so a nil client is the honest thing to hand them — if one of
// them ever starts reaching for the network, these tests panic rather than
// quietly passing against a chain that happened to be up.
func offline(t *testing.T, chainID int64) *evmChain {
	t.Helper()
	master, err := bip32.NewMasterKey(bip39.NewSeed(testMnemonic, ""))
	if err != nil {
		t.Fatalf("master key: %v", err)
	}
	prefix, err := accounts.ParseDerivationPath("m/9000'/3'/2'")
	if err != nil {
		t.Fatalf("derivation path: %v", err)
	}
	return &evmChain{
		chainID: big.NewInt(chainID),
		network: "lux-local",
		prefix:  prefix,
		master:  master,
		assets:  map[string]common.Address{},
		keys:    map[string]*ecdsa.PrivateKey{},
		tokenDp: map[common.Address]int32{},
	}
}

// TestLoadRefusesAChainItHasNoDeploymentFor is the difference between a bank
// pointed at the wrong chain and one whose deployment is missing. Both are
// operator errors and both must say which chain and where it looked, because
// the file is named for the chain id and that is exactly what is easy to get
// wrong.
func TestLoadRefusesAChainItHasNoDeploymentFor(t *testing.T) {
	c := offline(t, 96369)
	err := c.load(t.TempDir())
	if err == nil {
		t.Fatal("a missing deployment loaded, so the bank would run against a chain it has no address book for")
	}
	if !strings.Contains(err.Error(), "96369") {
		t.Errorf("the error does not name the chain it wanted: %v", err)
	}
}

func TestLoadRefusesADeploymentItCannotRead(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "96369.json"), []byte("{ this is not json"), 0o600); err != nil {
		t.Fatal(err)
	}
	c := offline(t, 96369)
	err := c.load(dir)
	if err == nil {
		t.Fatal("a corrupt deployment loaded, leaving every address zero")
	}
	if !strings.Contains(err.Error(), "unreadable") {
		t.Errorf("a corrupt file should say so, not %v", err)
	}
}

// TestLoadCarriesTheNativeCoinWithoutAContract pins the shape the wallet reads:
// the chain's own coin is always present and always maps to no contract, which
// is how a caller tells native from token. It needs no chain because a
// deployment that lists no bridged tokens asks nothing of one.
func TestLoadCarriesTheNativeCoinWithoutAContract(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "96369.json"),
		[]byte(`{"chainId":96369,"maxLtvBps":5000,"tokens":{}}`), 0o600); err != nil {
		t.Fatal(err)
	}
	c := offline(t, 96369)
	if err := c.load(dir); err != nil {
		t.Fatalf("a deployment with no bridged tokens should load: %v", err)
	}
	assets := c.Assets()
	if got, ok := assets["LUX"]; !ok || got != "" {
		t.Errorf(`the chain's own coin should be present with no contract, got %q (present: %v)`, got, ok)
	}
	if c.deploy.MaxLTVBps != 5000 {
		t.Errorf("the borrow ceiling did not survive the read: %d", c.deploy.MaxLTVBps)
	}
}

// TestAssetsRendersATokenAsItsAddress is the other half of the same shape.
func TestAssetsRendersATokenAsItsAddress(t *testing.T) {
	c := offline(t, 96369)
	token := common.HexToAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3")
	c.assets["LUX"] = common.Address{}
	c.assets["ETH"] = token
	assets := c.Assets()
	if assets["ETH"] != token.Hex() {
		t.Errorf("a token asset rendered as %q, not its address", assets["ETH"])
	}
	if assets["LUX"] != "" {
		t.Errorf("the native coin rendered as %q, so a caller cannot tell it from a token", assets["LUX"])
	}
}

func TestNetworkIsWhatItWasConfiguredWith(t *testing.T) {
	if got := offline(t, 96369).Network(); got != "lux-local" {
		t.Errorf("Network() = %q", got)
	}
}

// TestValidJudgesTheAddressAndIgnoresTheAsset — one chain, one address family.
// A bridged BTC balance is sent to a 0x address like anything else, so naming
// an asset must not change the answer.
func TestValidJudgesTheAddressAndIgnoresTheAsset(t *testing.T) {
	c := offline(t, 96369)
	const good = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
	for _, asset := range []string{"LUX", "BTC", "ETH", ""} {
		if !c.Valid(asset, good) {
			t.Errorf("a well-formed address was refused for asset %q", asset)
		}
	}
	for name, addr := range map[string]string{
		"empty":             "",
		"missing 0x":        "5FbDB2315678afecb367f032d93F642f64180aa3",
		"too short":         "0x5FbDB2315678afecb367f032d93F642f64180a",
		"not hex":           "0xZZbDB2315678afecb367f032d93F642f64180aa3",
		"a bad checksum":    "0x5fBDB2315678afecb367f032d93F642f64180aa3",
		"a bitcoin address": "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
	} {
		if c.Valid("LUX", addr) {
			t.Errorf("%s was accepted as a destination: %q", name, addr)
		}
	}
}

// TestEachAccountIndexGetsItsOwnAddress is the property the ledger rests on,
// checked without a chain: derivation is a pure function of the mnemonic and
// the index, so it is the same answer here as against a node.
func TestEachAccountIndexGetsItsOwnAddress(t *testing.T) {
	c := offline(t, 96369)
	seen := map[string]string{}
	for i := range 32 {
		index := strconv.Itoa(i)
		addr := c.address(index)
		if !validEVMAddress(addr) {
			t.Fatalf("index %s derived %q, which is not an address", index, addr)
		}
		if prev, clash := seen[addr]; clash {
			t.Fatalf("indexes %s and %s share address %s — two customers, one balance", prev, index, addr)
		}
		seen[addr] = index
	}
	// Derivation is deterministic, so the same index is the same address on
	// every process that holds the mnemonic. Nothing else could be true: the
	// ledger stores the index, not the address.
	if again := offline(t, 96369).address("7"); again != c.address("7") {
		t.Errorf("index 7 derived two different addresses: %s and %s", again, c.address("7"))
	}
}

// TestAnIndexThatIsNotANumberGetsNoAddress — address() answers "" rather than
// guessing, and a caller that treats "" as an address gets caught by Valid.
func TestAnIndexThatIsNotANumberGetsNoAddress(t *testing.T) {
	c := offline(t, 96369)
	for _, index := range []string{"", "-1", "abc", "1.5", "0x1", "99999999999999999999"} {
		if got := c.address(index); got != "" {
			t.Errorf("index %q derived %q instead of nothing", index, got)
		}
	}
}

// TestNoAccountIndexReachesTheTreasury is the reason customer and treasury are
// different branches rather than different numbers on one. The treasury holds
// the deployment and funds everyone's gas; an account index that landed on it
// would hand a customer the bank's own key. The branch is hardened, so this
// cannot happen by construction — this checks the construction is still the one
// described.
func TestNoAccountIndexReachesTheTreasury(t *testing.T) {
	c := offline(t, 96369)
	key, err := c.Treasury()
	if err != nil {
		t.Fatalf("treasury key: %v", err)
	}
	vault := addressOf(key).Hex()
	for i := range 256 {
		if got := c.address(strconv.Itoa(i)); got == vault {
			t.Fatalf("account index %d derives the treasury address %s", i, vault)
		}
	}
	// Account zero is the one a reader expects to be special, and it is not.
	if c.address("0") == vault {
		t.Fatal("account zero is the treasury")
	}
}

func TestEnvOrIgnoresAnEmptyOrBlankSetting(t *testing.T) {
	const key = "BANK_TEST_ENVOR"
	for name, tc := range map[string]struct{ set, want string }{
		"a real value":      {"lux-mainnet", "lux-mainnet"},
		"whitespace only":   {"   ", "fallback"},
		"empty":             {"", "fallback"},
		"padded real value": {"  lux-mainnet  ", "lux-mainnet"},
	} {
		t.Setenv(key, tc.set)
		if got := envOr(key, "fallback"); got != tc.want {
			t.Errorf("%s: envOr = %q, want %q", name, got, tc.want)
		}
	}
	os.Unsetenv(key)
	if got := envOr(key, "fallback"); got != "fallback" {
		t.Errorf("unset: envOr = %q", got)
	}
}
