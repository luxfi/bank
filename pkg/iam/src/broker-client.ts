import axios, {type AxiosInstance} from 'axios';
import type {BrokerConfig} from './config';

// --- Order types ---

export interface CreateOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  quantity: number;
  price?: number;
  timeInForce?: 'day' | 'gtc' | 'ioc' | 'fok';
}

export interface Order {
  id: string;
  accountId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  quantity: number;
  filledQuantity: number;
  price: number;
  averagePrice: number;
  status: 'new' | 'partial' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ListOrdersParams {
  status?: string;
  symbol?: string;
  side?: string;
  limit?: number;
  offset?: number;
}

// --- Position types ---

export interface Position {
  symbol: string;
  quantity: number;
  averageEntryPrice: number;
  marketValue: number;
  unrealizedPl: number;
  side: 'long' | 'short';
}

// --- Market data types ---

export interface Snapshot {
  symbol: string;
  lastPrice: number;
  bidPrice: number;
  askPrice: number;
  volume: number;
  timestamp: string;
}

export interface Bar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BarsParams {
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  start?: string;
  end?: string;
  limit?: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  class: 'crypto' | 'equity' | 'forex' | 'commodity';
  exchange: string;
  tradable: boolean;
  marginable: boolean;
  status: 'active' | 'inactive';
}

// --- Funding types ---

export interface DepositRequest {
  amount: string;
  currency: string;
  source: string;
  chain?: string;
}

export interface DepositResult {
  id: string;
  accountId: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface WithdrawRequest {
  amount: string;
  currency: string;
  destination: string;
  chain?: string;
}

export interface WithdrawResult {
  id: string;
  accountId: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export class BrokerClient {
  private readonly http: AxiosInstance;

  constructor(config: BrokerConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // --- Trading ---

  /** Create a new order for an account */
  async createOrder(accountId: string, order: CreateOrderRequest): Promise<Order> {
    const {data} = await this.http.post(`/api/v1/accounts/${accountId}/orders`, order);
    return data;
  }

  /** List orders for an account */
  async listOrders(accountId: string, params?: ListOrdersParams): Promise<Order[]> {
    const {data} = await this.http.get(`/api/v1/accounts/${accountId}/orders`, {params});
    return data.orders || data;
  }

  /** Cancel an order */
  async cancelOrder(accountId: string, orderId: string): Promise<void> {
    await this.http.delete(`/api/v1/accounts/${accountId}/orders/${orderId}`);
  }

  /** Get all positions for an account */
  async getPositions(accountId: string): Promise<Position[]> {
    const {data} = await this.http.get(`/api/v1/accounts/${accountId}/positions`);
    return data.positions || data;
  }

  /** Close a position by symbol */
  async closePosition(accountId: string, symbol: string): Promise<Order> {
    const {data} = await this.http.delete(`/api/v1/accounts/${accountId}/positions/${symbol}`);
    return data;
  }

  // --- Market Data ---

  /** Get a market snapshot for a symbol */
  async getSnapshot(symbol: string): Promise<Snapshot> {
    const {data} = await this.http.get(`/api/v1/market/${symbol}/snapshot`);
    return data;
  }

  /** Get OHLCV bars for a symbol */
  async getBars(symbol: string, params: BarsParams): Promise<Bar[]> {
    const {data} = await this.http.get(`/api/v1/market/${symbol}/bars`, {params});
    return data.bars || data;
  }

  /** List all tradable assets */
  async getAssets(): Promise<Asset[]> {
    const {data} = await this.http.get('/api/v1/assets');
    return data.assets || data;
  }

  // --- Funding ---

  /** Deposit funds into an account */
  async deposit(accountId: string, req: DepositRequest): Promise<DepositResult> {
    const {data} = await this.http.post(`/api/v1/accounts/${accountId}/deposits`, req);
    return data;
  }

  /** Withdraw funds from an account */
  async withdraw(accountId: string, req: WithdrawRequest): Promise<WithdrawResult> {
    const {data} = await this.http.post(`/api/v1/accounts/${accountId}/withdrawals`, req);
    return data;
  }
}
