// Wiring: register the data-defined tools onto an McpServer. Takes a Bank so a
// test can pass one backed by a mock fetch; the bin (index.ts) passes a real one.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { Bank } from '@luxfi/bank'
import { BankError } from '@luxfi/bank'
import { tools } from './tools.js'

export function createServer(bank: Bank): McpServer {
  const server = new McpServer({ name: 'luxfi-bank', version: '1.0.0' })

  for (const tool of tools) {
    const cb = async (args: Record<string, unknown>): Promise<CallToolResult> => {
      try {
        const result = await tool.run(bank, args as never)
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      } catch (e) {
        // A BankError becomes an isError result carrying the upstream status —
        // never a thrown exception that would drop the connection.
        const msg = e instanceof BankError ? `bank error ${e.status}: ${e.message}` : String(e)
        return { isError: true, content: [{ type: 'text', text: msg }] }
      }
    }
    // The SDK's registerTool infers its callback type from an internal
    // ZodRawShapeCompat our z.ZodRawShape does not structurally satisfy; the cb
    // is correctly typed on both ends, so we bridge the gap at this boundary.
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: tool.inputSchema },
      cb as Parameters<typeof server.registerTool>[2],
    )
  }

  return server
}
