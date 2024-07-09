export interface Conversion {
  trades: Trade[];
}

export interface Trade {
  amount: number;
  direction: string;
  buyCurrency: string;
  sellCurrency: string;
}
