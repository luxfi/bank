#!/usr/bin/env bash
# Deploys the Lux Financial on-chain stack to one EVM chain and records the
# addresses under deploy/<chainId>.json.
#
# The chain is an argument, never a constant: Lux, Zoo and Hanzo are sovereign
# L1s with their own EVM chain IDs, and each gets its own deployment file. The
# bank resolves contracts by the chain ID it reads from its RPC, so adding a
# chain is a run of this script, not an edit anywhere.
#
#   RPC=… PRIVATE_KEY=… OWNER=0x… ORACLE=0x… ./deploy.sh
#
# PRIVATE_KEY signs, and that is all it does — it owns nothing when this
# returns. OWNER ends up holding the protocol: the markets are nominated to it,
# the fees are paid to it, and it is the only account that can bridge collateral
# in or whitelist a minter. ORACLE ends up holding one thing, the yield index of
# each market, and can only ever raise it. Both are addresses you already
# control; a multisig for OWNER, the key that posts yield for ORACLE. In
# production PRIVATE_KEY comes from KMS (providers/<org>/deploy-mnemonic), not
# from a shell, and is never echoed.
set -euo pipefail

cd "$(dirname "$0")"
RPC="${RPC:-http://127.0.0.1:8645}"
export FOUNDRY_DISABLE_NIGHTLY_WARNING=1

for v in PRIVATE_KEY OWNER ORACLE; do
    [ -n "${!v:-}" ] || { echo "$v is not set" >&2; exit 1; }
done

# The canonical contracts are the sibling checkouts, not a vendored copy — the
# tokens come from luxfi/standard and the protocol from luxfi/liquid.
for repo in standard liquid; do
    [ -d "../../$repo/src" ] || [ -d "../../$repo/contracts" ] || {
        echo "missing sibling checkout ../../$repo" >&2; exit 1; }
done

# What each step compiles, hashed: every file in its import closure, by content.
# The checkouts are symlinks to whatever those repos happen to be at right now,
# so a released tag would not pin them and a branch name pins nothing at all.
# This does: it is the bytes solc read, and pins holds the bytes this deployment
# was driven against and verified on.
digest() { jq -S '.metadata.sources | map_values(.keccak256)' "out/$1/$2.s.sol/$2.json" | shasum -a 256 | cut -c1-64; }

verify() {
    FOUNDRY_PROFILE="$1" forge build >/dev/null
    local is want
    is=$(digest "$1" "$2")
    want=$(awk -v k="$1" '$1 == k { print $2 }' pins)
    [ "$is" = "$want" ] || {
        echo "$1: upstream moved out from under this deploy" >&2
        echo "  pinned $want" >&2
        echo "  found  $is" >&2
        echo "  re-run the market checks against it, then write the new digest into chain/pins" >&2
        exit 1; }
    echo "$is"
}

tokens=$(verify tokens Tokens)
protocol=$(verify protocol Protocol)
grants=$(verify grants Grants)

chain=$(cast chain-id --rpc-url "$RPC")
mkdir -p out deploy
echo "==> chain $chain via $RPC"
echo "==> owner $OWNER, oracle $ORACLE"

run() {
    FOUNDRY_PROFILE="$1" forge script "script/$1/$2.s.sol:$2" \
        --rpc-url "$RPC" --broadcast --slow >/dev/null
    echo "==> $1 done"
}

run tokens Tokens
run protocol Protocol
run grants Grants

# The address book carries the sources it came from, so a chain deployed years
# apart from the next one can still say what it was built out of.
jq --arg t "$tokens" --arg p "$protocol" --arg g "$grants" \
    '.sources = {tokens: $t, protocol: $p, grants: $g}' \
    "deploy/$chain.json" > "out/$chain.json" && mv "out/$chain.json" "deploy/$chain.json"

echo "==> deploy/$chain.json"
cat "deploy/$chain.json"
