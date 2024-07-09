import { dataFetch } from '@/api/fetchers';

import { ICurrenciesAndCountries, ICurrenciesResponse, PATHS } from './types';

export async function getCurrenciesCountriesAPI(params?: {
  isCalledServer?: boolean;
}): Promise<Array<ICurrenciesAndCountries>> {
  const response = await dataFetch({
    endpoint: PATHS.CURRENCIES_COUNTRIES,
    method: 'GET',
    isCalledServer: params?.isCalledServer,
  });

  return response?.data ?? [];
}

export async function getCountriesAPI(params?: {
  isCalledServer?: boolean;
}): Promise<Array<ICurrenciesAndCountries>> {
  const response = await dataFetch({
    endpoint: PATHS.COUNTRIES,
    method: 'GET',
    isCalledServer: params?.isCalledServer,
  });

  return response?.data ?? [];
}

export async function getCurrenciesAPI(params?: {
  isCalledServer?: boolean;
}): Promise<Array<ICurrenciesResponse>> {
  const response = await dataFetch({
    endpoint: PATHS.CURRENCIES,
    method: 'GET',
    isCalledServer: params?.isCalledServer,
  });

  return response?.data ?? [];
}

export async function getBalancesAPI(params?: {
  isCalledServer?: boolean;
}): Promise<Array<ICurrenciesResponse>> {
  const response = await dataFetch({
    endpoint: PATHS.BALANCES,
    method: 'GET',
    isCalledServer: params?.isCalledServer,
  });

  return response?.data ?? [];
}
