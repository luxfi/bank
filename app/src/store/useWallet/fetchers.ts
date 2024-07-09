import { currenciesArray } from '@/models/countries';

import { dataFetch } from '@/api/fetchers';

import {
  IWallet,
  IWalletCurrency,
  IWalletDetails,
  IWalletDetailsParams,
  PATHS,
} from './types';

export async function getWalletsBalances(params?: {
  isCalledServer?: boolean;
}): Promise<Array<IWallet>> {
  const response = await dataFetch({
    endpoint: PATHS.WALLETS_BALANCES,
    method: 'GET',
    urlParams: params as unknown as Record<string, string>,
  });

  return response?.data ?? [];
}

export async function getWalletsDetails(
  params?: IWalletDetailsParams
): Promise<Array<IWalletDetails>> {
  const response = await dataFetch({
    endpoint: PATHS.WALLETS_DETAILS,
    method: 'GET',
    urlParams: params as unknown as Record<string, string>,
  });

  return response?.data ?? [];
}

export async function getWalletsCurrenciesAPI(
  params?: IWalletDetailsParams
): Promise<any> {
  const response = await dataFetch({
    endpoint: PATHS.WALLETS_CURRENCIES,
    method: 'GET',
    urlParams: params as unknown as Record<string, string>,
  });

  return response?.data ?? [];
}

export async function getWalletCurrencyByIdAPI(
  currency: keyof typeof currenciesArray
): Promise<IWalletCurrency> {
  const response = await dataFetch({
    endpoint: PATHS.WALLETS_BY_CURRENCY(currency),
    method: 'GET',
  });

  return response?.data ?? {};
}
