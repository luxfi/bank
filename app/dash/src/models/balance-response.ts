export interface IBalanceResponse {
  id: string;
  account_id: string;
  currency: string;
  amount: string;
  status?: string;
}
export interface ICurrenciesResponse {
  code: string;
  decimal_places: string;
  name: string;
  online_trading: boolean;
  can_buy: boolean;
  can_sell: boolean;
  can_deposit?: boolean;
}
