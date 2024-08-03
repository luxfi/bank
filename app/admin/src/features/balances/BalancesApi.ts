import * as ApiHelpers from "../../utils/api-helpers";
import { BalanceDto } from "./model/balance-dto";
import { BalanceResponse, CurrenciesResponse } from "./model/balance-response";


export const balance_list =async (): Promise<BalanceResponse[]> => {
  // console.log('balances_list')
  const res = await ApiHelpers.fetch("/api/v1/currencycloud/balances", {
    method: "GET"
  });
  const {statusCode, data, message} = await res.json();
  if(statusCode === 200){
    return data?.balances || [];
  }
  if (message && message !== "Internal server error") {
    if(message == 'Logged in user is not approved.')
      throw new Error('You still do not have access to functionalities such as adding currencies, making payments, etc.');
    else
      throw new Error(message);
  }

  throw new Error("Couldn't load balances, please try again.");
}

export const currencies_list =async (): Promise<CurrenciesResponse[]> => {
  const res = await ApiHelpers.fetch("/api/v1/currencycloud/currencies", {
    method: "GET"
  });
  const {statusCode, data, message} = await res.json();
  
  if(statusCode === 200){
    return data?.currencies || [];
  }
  if (message && message !== "Internal server error") {
    if(message == 'Logged in user is not approved.')
      throw new Error('You still do not have access to functionalities such as adding currencies, making payments, etc.');
    else
      throw new Error(message);
  }

  throw new Error("Couldn't load balances, please try again.");
}
