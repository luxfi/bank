#!/usr/bin/env node
// @luxfi/bank-mcp — an MCP server that gives an agent typed tools over the Lux
// banking API. Thin adapter: every tool is one @luxfi/bank call, so the wire
// contract, types, and auth are the SDK's (see tools.ts / server.ts).
//
// Config (env):
//   BANK_API_URL  — API origin (default https://api.sandbox.lux.financial)
//   BANK_TOKEN    — IAM bearer token for the acting principal
//
// The token authorizes every call as one principal — run one server per user.

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Bank } from '@luxfi/bank'
import { createServer } from './server.js'

const bank = new Bank({
  baseUrl: process.env.BANK_API_URL || 'https://api.sandbox.lux.financial',
  token: () => process.env.BANK_TOKEN,
})

createServer(bank)
  .connect(new StdioServerTransport())
  .catch((e) => {
    console.error('luxfi-bank-mcp failed to start:', e)
    process.exit(1)
  })
