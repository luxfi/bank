export interface Country {
  id: string;
  name: string;
}

export interface CurrencyCountry {
  id: string;
  name: string;
}

export interface TState {
  countries: Country[];
  currenciesCountries: CurrencyCountry[]; // Ensure this is included
  allCurrencies: any[];
  balances: any[];
}

export interface TActions {
  getCountries: () => Promise<void>;
  getCurrenciesCountries: () => Promise<void>;
  setAllCurrencies: () => Promise<void>;
  setBalances: () => Promise<void>;
}
