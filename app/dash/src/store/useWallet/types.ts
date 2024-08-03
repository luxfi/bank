import { ITransactionV2 } from '@/models/transactions';

import { IDefaultStates } from '../helpers/setStates';
import { currenciesArray } from './../../models/countries';

export type TState = IDefaultStates<TActions> & {
  isLoading: boolean;
  walletSelected?: IWalletSelected;
  walletsError?: string;
};

export type TActions = {
  getWallets(data: IWalletPayload): Promise<Array<IWallet>>;
  getAllCurrencies(): Promise<Array<IWallet>>;
  getWalletsCurrencies(): Promise<Array<IWallet>>;
  getCurrencyWallet(
    currency: keyof typeof currenciesArray
  ): Promise<IWalletCurrency>;
  setWalletSelected(wallet: IWallet): Promise<void>;

  clearWallets(): void;
};

export interface IWalletSelected extends IWallet {
  transaction?: Array<ITransactionV2>;
  details?: Array<IWalletDetails>;
}

export interface IWallet {
  name: string;
  currency: string;
  amount: number;
}

export interface IRoutingCode {
  name: string;
  value: string;
}

export interface IWalletDetails {
  accountHolderName: string;
  bankName: string;
  bankAddress: string;
  bankCountryCode: string;
  bankCountryName: string;
  routingCodes: Array<IRoutingCode>;
}

export interface ICurrencyAccount {
  currency: string;
  accountId: string;
}

export interface IWalletCurrency {
  currency: keyof typeof currenciesArray;
  name: string;
  amount: number;
}

interface IWalletPayload {}

export interface IWalletDetailsParams {
  currency?: string;
  account?: string;
  paymentType?: string;
  page?: number;
  limit?: number;
}

export const PATHS = {
  WALLETS_BALANCES: '/api/v2/wallets/balances',
  WALLETS_DETAILS: '/api/v2/wallets/details',
  WALLETS_CURRENCIES: '/api/v2/wallets/currencies',
  WALLETS_BY_CURRENCY: (currency: keyof typeof currenciesArray) =>
    `/api/v2/wallets/balance/${currency}`,
};
