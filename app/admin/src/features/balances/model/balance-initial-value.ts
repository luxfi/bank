import { BalanceDto, CurrenciesDto } from "./balance-dto";

export const initialBalanceValues: BalanceDto = {
  account_id: "",
  currency: "",
  amount: ""
}
export const initialCurrenciesValues: CurrenciesDto = {
  code: "",
  decimal_places: "",
  name: "",
  online_trading: true,
  can_buy: true,
  can_sell: true,
}
