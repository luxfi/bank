import { currenciesArray } from '@/models/countries';

import { StoreApi, UseBoundStore, create } from 'zustand';

import { setErrorState, setLoadingState } from '../helpers/setStates';
import {
  getWalletCurrencyByIdAPI,
  getWalletsBalances,
  getWalletsCurrenciesAPI,
  getWalletsDetails,
} from './fetchers';
import { IWalletCurrency, TActions, TState } from './types';

export const useWallet: UseBoundStore<StoreApi<TState & TActions>> = create<
  TState & TActions
>((set) => ({
  isLoading: false,
  errors: {} as TState['errors'],
  loading: {} as TState['loading'],

  clearWallets: () => {
    set({
      walletSelected: undefined,
    });
  },

  getWalletsCurrencies: async () => {
    setLoadingState(useWallet, 'getWalletsCurrencies', true);
    return await getWalletsCurrenciesAPI().finally(() => {
      setLoadingState(useWallet, 'getWalletsCurrencies', false);
    });
  },

  setWalletSelected: async (wallet: any) => {
    setLoadingState(useWallet, 'setWalletSelected', true);
    try {
      const details = await getWalletsDetails({
        currency: wallet.currency,
      }).catch((error) => set({ walletsError: `Details Error - ${error}` }));

      set({
        walletSelected: {
          amount: wallet.amount,
          currency: wallet.currency,
          name: wallet.name,
          details: details ?? [],
        },
      });
    } catch (error) {
      setErrorState(useWallet, 'setWalletSelected', String(error));
    } finally {
      setLoadingState(useWallet, 'setWalletSelected', false);
    }
  },

  getWallets: async (payload) => {
    set({ isLoading: true });
    return await getWalletsBalances({ ...payload })
      .catch((error) => {
        set({ walletsError: error });
        return [];
      })
      .finally(() => set({ isLoading: false }));
  },

  getAllCurrencies: async () => {
    set({ isLoading: true });
    return await getWalletsBalances()
      .catch((error) => {
        set({ walletsError: error });
        return [];
      })
      .finally(() => set({ isLoading: false }));
  },

  getCurrencyWallet: async (currency: keyof typeof currenciesArray) => {
    setLoadingState(useWallet, 'getCurrencyWallet', true);
    return await getWalletCurrencyByIdAPI(currency)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        setErrorState(useWallet, 'getCurrencyWallet', error);
        return {} as IWalletCurrency;
      })
      .finally(() => {
        setLoadingState(useWallet, 'getCurrencyWallet', false);
      });
  },
}));
