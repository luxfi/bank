import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// --- KMS types ---
interface KmsSignRequest {
  key_id: string;
  payload: string; // hex-encoded
  algorithm?: string;
}

interface KmsSignResponse {
  signature: string;
  key_id: string;
}

// --- MPC types ---
interface MpcSignRequest {
  wallet_id: string;
  payload: string; // hex-encoded message hash
  chain?: string;
}

interface MpcSignResponse {
  r: string;
  s: string;
  signature: string;
}

// --- CEX types ---
interface CexOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  quantity: number;
  price?: number;
  time_in_force?: string;
}

interface CexOrderResponse {
  id: string;
  account_id: string;
  symbol: string;
  side: string;
  type: string;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
}

// --- DEX types ---
interface DexOrderRequest {
  jsonrpc: '2.0';
  method: string;
  params: {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'limit' | 'market';
    quantity: number;
    price?: number;
    account_id: string;
  };
  id: number;
}

interface DexOrderResponse {
  jsonrpc: '2.0';
  result?: {
    order_id: string;
    status: string;
  };
  error?: {
    code: number;
    message: string;
  };
  id: number;
}

interface OrderBookQuote {
  bestBid: number;
  bestAsk: number;
  spread: number;
  source: 'cex' | 'dex';
}

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);

  private readonly kmsBaseUrl: string;
  private readonly kmsApiKey: string;
  private readonly mpcBaseUrl: string;
  private readonly mpcApiKey: string;
  private readonly cexBaseUrl: string;
  private readonly cexApiKey: string;
  private readonly dexBaseUrl: string;
  private readonly dexApiKey: string;
  private dexRpcId = 0;

  constructor(private readonly configService: ConfigService) {
    this.kmsBaseUrl = configService.get<string>('KMS_BASE_URL', 'http://localhost:8081');
    this.kmsApiKey = configService.get<string>('KMS_API_KEY', '');
    this.mpcBaseUrl = configService.get<string>('MPC_BASE_URL', 'http://localhost:8082');
    this.mpcApiKey = configService.get<string>('MPC_API_KEY', '');
    this.cexBaseUrl = configService.get<string>('CEX_BASE_URL', 'http://localhost:8080');
    this.cexApiKey = configService.get<string>('CEX_API_KEY', '');
    this.dexBaseUrl = configService.get<string>('DEX_BASE_URL', 'http://localhost:8090');
    this.dexApiKey = configService.get<string>('DEX_API_KEY', '');
  }

  // --- KMS Integration ---

  async kmsSign(keyId: string, payload: string): Promise<KmsSignResponse> {
    const body: KmsSignRequest = { key_id: keyId, payload };
    const res = await this.post<KmsSignResponse>(
      `${this.kmsBaseUrl}/api/v1/keys/${keyId}/sign`,
      body,
      this.kmsApiKey,
    );
    this.logger.debug(`KMS signed with key ${keyId}`);
    return res;
  }

  // --- MPC Integration ---

  async mpcSign(walletId: string, payload: string, chain?: string): Promise<MpcSignResponse> {
    const body: MpcSignRequest = { wallet_id: walletId, payload, chain };
    const res = await this.post<MpcSignResponse>(
      `${this.mpcBaseUrl}/api/v1/generate_mpc_sig`,
      body,
      this.mpcApiKey,
    );
    this.logger.debug(`MPC signed for wallet ${walletId}`);
    return res;
  }

  // --- CEX Integration ---

  async cexSubmitOrder(accountId: string, order: CexOrderRequest): Promise<CexOrderResponse> {
    const res = await this.post<CexOrderResponse>(
      `${this.cexBaseUrl}/api/v1/accounts/${accountId}/orders`,
      order,
      this.cexApiKey,
    );
    this.logger.log(`CEX order ${res.id} submitted: ${order.side} ${order.quantity} ${order.symbol}`);
    return res;
  }

  async cexGetOrderBook(symbol: string): Promise<OrderBookQuote | null> {
    try {
      const res = await this.get<{ bids: { price: number }[]; asks: { price: number }[] }>(
        `${this.cexBaseUrl}/api/v1/markets/${symbol}/book?depth=1`,
        this.cexApiKey,
      );
      if (!res.bids?.length || !res.asks?.length) return null;
      const bestBid = res.bids[0].price;
      const bestAsk = res.asks[0].price;
      return { bestBid, bestAsk, spread: bestAsk - bestBid, source: 'cex' };
    } catch {
      return null;
    }
  }

  async cexCancelOrder(orderId: string): Promise<CexOrderResponse> {
    return this.del<CexOrderResponse>(
      `${this.cexBaseUrl}/api/v1/accounts/_/orders/${orderId}`,
      this.cexApiKey,
    );
  }

  // --- DEX Integration ---

  async dexSubmitOrder(accountId: string, order: CexOrderRequest): Promise<DexOrderResponse> {
    const rpcReq: DexOrderRequest = {
      jsonrpc: '2.0',
      method: 'dex.submitOrder',
      params: {
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        account_id: accountId,
      },
      id: ++this.dexRpcId,
    };
    const res = await this.post<DexOrderResponse>(
      `${this.dexBaseUrl}/rpc`,
      rpcReq,
      this.dexApiKey,
    );
    if (res.error) {
      throw new Error(`DEX error ${res.error.code}: ${res.error.message}`);
    }
    this.logger.log(`DEX order ${res.result?.order_id} submitted: ${order.side} ${order.quantity} ${order.symbol}`);
    return res;
  }

  async dexGetOrderBook(symbol: string): Promise<OrderBookQuote | null> {
    try {
      const rpcReq = {
        jsonrpc: '2.0',
        method: 'dex.getOrderBook',
        params: { symbol, depth: 1 },
        id: ++this.dexRpcId,
      };
      const res = await this.post<{
        jsonrpc: string;
        result?: { bids: { price: number }[]; asks: { price: number }[] };
        error?: { code: number; message: string };
        id: number;
      }>(`${this.dexBaseUrl}/rpc`, rpcReq, this.dexApiKey);

      if (res.error || !res.result?.bids?.length || !res.result?.asks?.length) return null;
      const bestBid = res.result.bids[0].price;
      const bestAsk = res.result.asks[0].price;
      return { bestBid, bestAsk, spread: bestAsk - bestBid, source: 'dex' };
    } catch {
      return null;
    }
  }

  // --- Smart Order Router ---

  async submitOrder(
    accountId: string,
    order: CexOrderRequest,
    preferVenue?: 'cex' | 'dex',
  ): Promise<{ venue: string; order: CexOrderResponse | DexOrderResponse }> {
    // If explicit preference, route directly
    if (preferVenue === 'cex') {
      const res = await this.cexSubmitOrder(accountId, order);
      return { venue: 'cex', order: res };
    }
    if (preferVenue === 'dex') {
      const res = await this.dexSubmitOrder(accountId, order);
      return { venue: 'dex', order: res };
    }

    // Smart routing: compare order books for best price
    const [cexQuote, dexQuote] = await Promise.all([
      this.cexGetOrderBook(order.symbol),
      this.dexGetOrderBook(order.symbol),
    ]);

    // Determine best venue by effective price
    let bestVenue: 'cex' | 'dex' = 'cex'; // default
    if (cexQuote && dexQuote) {
      if (order.side === 'buy') {
        // Buyer wants lowest ask
        bestVenue = dexQuote.bestAsk < cexQuote.bestAsk ? 'dex' : 'cex';
      } else {
        // Seller wants highest bid
        bestVenue = dexQuote.bestBid > cexQuote.bestBid ? 'dex' : 'cex';
      }
    } else if (dexQuote && !cexQuote) {
      bestVenue = 'dex';
    }
    // if only cexQuote or neither, default to cex

    this.logger.log(`Smart route: ${order.symbol} ${order.side} -> ${bestVenue}`);

    if (bestVenue === 'dex') {
      const res = await this.dexSubmitOrder(accountId, order);
      return { venue: 'dex', order: res };
    }
    const res = await this.cexSubmitOrder(accountId, order);
    return { venue: 'cex', order: res };
  }

  // --- HTTP helpers ---

  private async post<T>(url: string, body: unknown, apiKey: string): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST ${url} failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
  }

  private async get<T>(url: string, apiKey: string): Promise<T> {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET ${url} failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
  }

  private async del<T>(url: string, apiKey: string): Promise<T> {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DELETE ${url} failed: ${res.status} ${text}`);
    }
    return res.json() as Promise<T>;
  }
}
