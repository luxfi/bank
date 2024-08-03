import * as yup from "yup";
import { initialBalanceValues, initialCurrenciesValues } from "./balance-initial-value";
import { BalanceResponse, CurrenciesResponse } from "./balance-response";
import { balanceSchema, currencySchema } from "./balance-schema";
export type BalanceDto = yup.TypeOf<typeof balanceSchema>
export type CurrenciesDto = yup.TypeOf<typeof currencySchema>
export function balanceDtoFromResponse(response: BalanceResponse): BalanceDto {
  return {
    account_id: response.account_id || initialBalanceValues.account_id,
    currency: response.currency || initialBalanceValues.currency,
    amount: response.amount || initialBalanceValues.amount
  }
}

export function currenciesDtoFromResponse(response: CurrenciesResponse): CurrenciesDto {
  return {
    code: response.code || initialCurrenciesValues.code,
    decimal_places: response.decimal_places || initialCurrenciesValues.decimal_places,
    name: response.name || initialCurrenciesValues.name,
    online_trading: response.online_trading || initialCurrenciesValues.online_trading,
    can_buy: response.can_buy || initialCurrenciesValues.can_buy,
    can_sell: response.can_sell || initialCurrenciesValues.can_sell,
  }
}
