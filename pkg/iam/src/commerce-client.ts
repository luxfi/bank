import axios, {type AxiosInstance} from 'axios';
import type {CommerceConfig} from './config';

// --- Payment types ---

export interface ChargeRequest {
  amount: number;
  currency: string;
  source: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface AuthorizeRequest {
  amount: number;
  currency: string;
  source: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';
  processor: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';
  processor: string;
  source: string;
  description?: string;
  refundedAmount?: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

export interface ProcessorInfo {
  id: string;
  name: string;
  type: string;
  currencies: string[];
  status: 'active' | 'inactive';
}

export class CommerceClient {
  private readonly http: AxiosInstance;

  constructor(config: CommerceConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /** Charge a payment source immediately */
  async charge(req: ChargeRequest): Promise<PaymentResult> {
    const {data} = await this.http.post('/api/v1/charges', req);
    return data;
  }

  /** Authorize a payment without capturing */
  async authorize(req: AuthorizeRequest): Promise<PaymentResult> {
    const {data} = await this.http.post('/api/v1/authorizations', req);
    return data;
  }

  /** Capture a previously authorized payment */
  async capture(transactionId: string, amount?: number): Promise<PaymentResult> {
    const {data} = await this.http.post(`/api/v1/transactions/${transactionId}/capture`, {
      ...(amount !== undefined ? {amount} : {}),
    });
    return data;
  }

  /** Refund a captured payment */
  async refund(transactionId: string, amount?: number): Promise<PaymentResult> {
    const {data} = await this.http.post(`/api/v1/transactions/${transactionId}/refund`, {
      ...(amount !== undefined ? {amount} : {}),
    });
    return data;
  }

  /** Get a transaction by ID */
  async getTransaction(transactionId: string): Promise<Transaction> {
    const {data} = await this.http.get(`/api/v1/transactions/${transactionId}`);
    return data;
  }

  /** List available payment processors */
  async listProcessors(): Promise<ProcessorInfo[]> {
    const {data} = await this.http.get('/api/v1/processors');
    return data.processors || data;
  }
}
