#!/usr/bin/env bash
# Deploys the Lux Financial on-chain stack to one EVM chain and records the
# addresses under deploy/<chainId>.json.
#
# The chain is an argument, never a constant: Lux, Zoo and Hanzo are sovereign
# L1s with their own EVM chain IDs, and each gets its own deployment file. The
# bank resolves contracts by the chain ID it reads from its RPC, so adding a
# chain is a run of this script, not an edit anywhere.
#
#   RPC=http://127.0.0.1:8645 PRIVATE_KEY=0x… ./deploy.sh     # local anvil
#   RPC=https://api.lux.network/v1/bc/C/rpc  PRIVATE_KEY=… ./deploy.sh
#
# PRIVATE_KEY is read from the environment and never echoed. In production it
# comes from KMS (providers/<org>/deploy-mnemonic), not from a shell.
set -euo pipefail

cd "$(dirname "$0")"
RPC="${RPC:-http://127.0.0.1:8645}"
export FOUNDRY_DISABLE_NIGHTLY_WARNING=1

[ -n "${PRIVATE_KEY:-}" ] || { echo "PRIVATE_KEY is not set" >&2; exit 1; }

# The canonical contracts are the sibling checkouts, not a vendored copy — the
# tokens come from luxfi/standard and the protocol from luxfi/liquid.
for repo in standard liquid; do
    [ -d "../../$repo/src" ] || [ -d "../../$repo/contracts" ] || {
        echo "missing sibling checkout ../../$repo" >&2; exit 1; }
done

chain=$(cast chain-id --rpc-url "$RPC")
mkdir -p out deploy
echo "==> chain $chain via $RPC"

run() {
    FOUNDRY_PROFILE="$1" forge script "script/$1/$2.s.sol:$2" \
        --rpc-url "$RPC" --broadcast --slow >/dev/null
    echo "==> $1 done"
}

run tokens Tokens
run protocol Protocol
run grants Grants

echo "==> deploy/$chain.json"
cat "deploy/$chain.json"
