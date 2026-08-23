# @luxfi/bank-mcp

An [MCP](https://modelcontextprotocol.io) server that gives an AI agent typed
tools over the Lux banking API. It is a thin adapter over
[`@luxfi/bank`](https://www.npmjs.com/package/@luxfi/bank): every tool calls one
SDK method, so the wire contract, types, and auth are the SDK's — this package
adds no logic of its own.

## Run

```bash
BANK_API_URL=https://api.sandbox.lux.financial \
BANK_TOKEN=<iam-bearer-token> \
npx @luxfi/bank-mcp
```

Or wire it into a client (e.g. Claude Desktop / Claude Code):

```json
{
  "mcpServers": {
    "lux-bank": {
      "command": "npx",
      "args": ["-y", "@luxfi/bank-mcp"],
      "env": {
        "BANK_API_URL": "https://api.sandbox.lux.financial",
        "BANK_TOKEN": "<iam-bearer-token>"
      }
    }
  }
}
```

The token authorizes every call as one principal — **run one server per user.**
Point `BANK_API_URL` at `https://api.sandbox.lux.financial` to explore against
the seeded demo, or `https://api.lux.financial` for production.

## Tools

| Tool | Does |
|---|---|
| `bank_plans`, `bank_config` | Membership ladder; public config + partner disclosure |
| `bank_overview`, `bank_accounts`, `bank_transactions` | Dashboard aggregate; account list; activity |
| `bank_balances`, `bank_wallet`, `bank_crypto_prices` | Balances; crypto wallet; reference prices |
| `bank_transfer`, `bank_pay` | Book transfer between own accounts; outbound payment to a beneficiary |
| `bank_beneficiaries`, `bank_create_beneficiary` | List / register payment recipients |
| `bank_send_crypto` | On-chain send (returns a txHash) |
| `bank_exchange_quote`, `bank_exchange` | Quote / execute a fiat-FX or crypto conversion |
| `bank_issue_card`, `bank_freeze_card`, `bank_unfreeze_card` | Card issuance and controls |
| `bank_card_account`, `bank_create_virtual_card`, `bank_order_virtual_card` | The provider-neutral issuer card lifecycle |

Amounts are integers in minor units (cents for fiat, 6-dp for crypto). Errors
surface as a tool result carrying the upstream status, never a dropped
connection. The interface standard is LP-3040.
