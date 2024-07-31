export type TState = {
  currencieCountries: Array<ICurrenciesAndCountries>;
  countries: Array<ICurrenciesAndCountries>;

  allCurrencies: Array<ICurrenciesResponse>;
  balances: Array<ICurrenciesResponse>;
};

export type TActions = {
  getCurrenciesCountries(): Promise<void>;
  getCountries(): Promise<void>;
  setAllCurrencies(): Promise<void>;
  setBalances(): Promise<void>;
};


export interface ICurrenciesAndCountries {
  code: string;
  name: string;
}

export interface ICurrenciesResponse {
  currency: string;
  name: string;
  amount?: number;
}

export const PATHS = {
  COUNTRIES: `/api/v2/misc/countries`,
  CURRENCIES_COUNTRIES: `/api/v2/misc/currencies`,

  CURRENCIES: `/api/v2/wallets/currencies`,
  BALANCES: '/api/v2/wallets/balances',
};


