import axios, {type AxiosInstance} from 'axios';
import type {MpcConfig} from './config';

export interface MpcWallet {
  id: string;
  address: string;
  chain: string;
  threshold: number;
  parties: number;
  status: 'active' | 'pending' | 'disabled';
  createdAt: string;
}

export interface MpcSignRequest {
  walletId: string;
  message: string;
  chain?: string;
}

export interface MpcSignResponse {
  signature: string;
  walletId: string;
  txHash?: string;
}

export interface MpcTransactionRequest {
  walletId: string;
  to: string;
  amount: string;
  chain: string;
  tokenAddress?: string;
  data?: string;
}

export interface MpcTransactionResponse {
  txHash: string;
  walletId: string;
  status: 'pending' | 'signed' | 'broadcast' | 'confirmed';
}

export class MpcClient {
  private readonly http: AxiosInstance;

  constructor(config: MpcConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /** Create a new MPC wallet */
  async createWallet(chain: string, threshold = 2, parties = 3): Promise<MpcWallet> {
    const {data} = await this.http.post('/api/v1/wallets', {chain, threshold, parties});
    return data;
  }

  /** List wallets */
  async listWallets(chain?: string): Promise<MpcWallet[]> {
    const {data} = await this.http.get('/api/v1/wallets', {params: chain ? {chain} : {}});
    return data.wallets || data;
  }

  /** Get wallet by ID */
  async getWallet(walletId: string): Promise<MpcWallet> {
    const {data} = await this.http.get(`/api/v1/wallets/${walletId}`);
    return data;
  }

  /** Sign a message using MPC threshold signing */
  async sign(request: MpcSignRequest): Promise<MpcSignResponse> {
    const {data} = await this.http.post(`/api/v1/wallets/${request.walletId}/sign`, {
      message: request.message,
      chain: request.chain,
    });
    return data;
  }

  /** Create and sign a transaction */
  async sendTransaction(request: MpcTransactionRequest): Promise<MpcTransactionResponse> {
    const {data} = await this.http.post(`/api/v1/wallets/${request.walletId}/transactions`, {
      to: request.to,
      amount: request.amount,
      chain: request.chain,
      tokenAddress: request.tokenAddress,
      data: request.data,
    });
    return data;
  }

  /** Get transaction status */
  async getTransaction(walletId: string, txHash: string): Promise<MpcTransactionResponse> {
    const {data} = await this.http.get(`/api/v1/wallets/${walletId}/transactions/${txHash}`);
    return data;
  }

  /** Get wallet balance */
  async getBalance(walletId: string, tokenAddress?: string): Promise<{balance: string; symbol: string}> {
    const {data} = await this.http.get(`/api/v1/wallets/${walletId}/balance`, {
      params: tokenAddress ? {tokenAddress} : {},
    });
    return data;
  }
}
