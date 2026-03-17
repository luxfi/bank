import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import {
  BrokerClient,
  KmsClient,
  MpcClient,
  BROKER_CLIENT,
  KMS_CLIENT,
  MPC_CLIENT,
  type CreateOrderRequest,
  type Order,
  type ListOrdersParams,
  type Position,
  type Snapshot,
  type Bar,
  type BarsParams,
  type Asset,
  type DepositRequest,
  type DepositResult,
  type WithdrawRequest,
  type WithdrawResult,
  type MpcWallet,
  type MpcSignResponse,
  type MpcTransactionRequest,
  type MpcTransactionResponse,
  type SignResponse as KmsSignResponse,
} from '@luxbank/iam';

@Injectable()
export class TradingService {
  private readonly logger = new Logger(TradingService.name);

  constructor(
    @Optional() @Inject(BROKER_CLIENT) private readonly broker: BrokerClient | null,
    @Optional() @Inject(KMS_CLIENT) private readonly kms: KmsClient | null,
    @Optional() @Inject(MPC_CLIENT) private readonly mpc: MpcClient | null,
  ) {}

  // --- Broker: Trading ---

  async placeOrder(accountId: string, order: CreateOrderRequest): Promise<Order> {
    this.requireBroker();
    const result = await this.broker!.createOrder(accountId, order);
    this.logger.log(`Order ${result.id}: ${order.side} ${order.quantity} ${order.symbol}`);
    return result;
  }

  async listOrders(accountId: string, params?: ListOrdersParams): Promise<Order[]> {
    this.requireBroker();
    return this.broker!.listOrders(accountId, params);
  }

  async cancelOrder(accountId: string, orderId: string): Promise<void> {
    this.requireBroker();
    await this.broker!.cancelOrder(accountId, orderId);
    this.logger.log(`Order ${orderId} cancelled`);
  }

  async getPositions(accountId: string): Promise<Position[]> {
    this.requireBroker();
    return this.broker!.getPositions(accountId);
  }

  async closePosition(accountId: string, symbol: string): Promise<Order> {
    this.requireBroker();
    const result = await this.broker!.closePosition(accountId, symbol);
    this.logger.log(`Position ${symbol} closed for account ${accountId}`);
    return result;
  }

  // --- Broker: Market Data ---

  async getMarketData(symbol: string): Promise<Snapshot> {
    this.requireBroker();
    return this.broker!.getSnapshot(symbol);
  }

  async getBars(symbol: string, params: BarsParams): Promise<Bar[]> {
    this.requireBroker();
    return this.broker!.getBars(symbol, params);
  }

  async getAssets(): Promise<Asset[]> {
    this.requireBroker();
    return this.broker!.getAssets();
  }

  // --- Broker: Funding ---

  async deposit(accountId: string, req: DepositRequest): Promise<DepositResult> {
    this.requireBroker();
    return this.broker!.deposit(accountId, req);
  }

  async withdraw(accountId: string, req: WithdrawRequest): Promise<WithdrawResult> {
    this.requireBroker();
    return this.broker!.withdraw(accountId, req);
  }

  // --- MPC Wallet Operations ---

  async createWallet(chain: string, threshold = 2, parties = 3): Promise<MpcWallet> {
    this.requireMpc();
    const wallet = await this.mpc!.createWallet(chain, threshold, parties);
    this.logger.log(`MPC wallet created: ${wallet.id} on ${chain}`);
    return wallet;
  }

  async listWallets(chain?: string): Promise<MpcWallet[]> {
    this.requireMpc();
    return this.mpc!.listWallets(chain);
  }

  async getWallet(walletId: string): Promise<MpcWallet> {
    this.requireMpc();
    return this.mpc!.getWallet(walletId);
  }

  async getBalance(walletId: string, tokenAddress?: string): Promise<{balance: string; symbol: string}> {
    this.requireMpc();
    return this.mpc!.getBalance(walletId, tokenAddress);
  }

  async signTransaction(walletId: string, message: string, chain?: string): Promise<MpcSignResponse> {
    this.requireMpc();
    return this.mpc!.sign({walletId, message, chain});
  }

  async sendTransaction(req: MpcTransactionRequest): Promise<MpcTransactionResponse> {
    this.requireMpc();
    return this.mpc!.sendTransaction(req);
  }

  // --- KMS Operations ---

  async kmsSign(keyId: string, message: string): Promise<KmsSignResponse> {
    this.requireKms();
    const result = await this.kms!.sign(keyId, message);
    this.logger.debug(`KMS signed with key ${keyId}`);
    return result;
  }

  async kmsVerify(keyId: string, message: string, signature: string): Promise<boolean> {
    this.requireKms();
    return this.kms!.verify(keyId, message, signature);
  }

  // --- Guards ---

  private requireBroker(): void {
    if (!this.broker) {
      throw new Error('Broker service not configured. Set BROKER_BASE_URL and BROKER_API_KEY.');
    }
  }

  private requireMpc(): void {
    if (!this.mpc) {
      throw new Error('MPC service not configured. Set MPC_BASE_URL and MPC_API_KEY.');
    }
  }

  private requireKms(): void {
    if (!this.kms) {
      throw new Error('KMS service not configured. Set KMS_BASE_URL and KMS_API_KEY.');
    }
  }
}
