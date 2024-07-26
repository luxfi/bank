export interface Wallet {
    id: string;
    accountName: string;
    iban: string;
    swiftBic: string;
    accountNumber: string;
    sortCode: string;
}
  
export interface WalletBalances {
    id: string;
    accountName: string;
    iban: string;
    swiftBic: string;
    accountNumber: string;
    sortCode: string;
    balances: Balance[];
}
  
export interface Balance {
    amount: number;
    currency: string;
}
  