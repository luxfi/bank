import { create } from 'zustand';

import {
  getBalancesAPI,
  getCountriesAPI,
  getCurrenciesAPI,
  getCurrenciesCountriesAPI,
} from './fetchers';
import { TActions, TState } from './types';

export const useCurrenciesAndCountries = create<TState & TActions>((set) => ({
  countries: [],
  currencieCountries: [],
  allCurrencies: [],
  balances: [],

  getCountries: async () => {
    const response = await getCurrenciesCountriesAPI();
    set({ currencieCountries: response });
  },
  getCurrenciesCountries: async () => {
    const response = await getCountriesAPI();
    set({ countries: response });
  },

  setAllCurrencies: async () => {
    const response = await Promise.all([getCurrenciesAPI(), getBalancesAPI()]);

    const [currencies, balances] = response;

    if (Array.isArray(balances) && Array.isArray(currencies)) {
      set({ allCurrencies: [...balances, ...currencies] });
    }
  },

  setBalances: async () => {
    await getBalancesAPI().then((response) => {
      set({ balances: response });
    });
  },
}));
