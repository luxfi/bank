import * as ApiHelpers from "../../utils/api-helpers";

export const searchTransactions = async (query: string, gateway = 'currencycloud') => {
  const res = await ApiHelpers.fetch(
    `/api/v1/${gateway}/search/transactions${query}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data;
  }
  throw new Error("Couldn't load the transaction data, please try again.");
};
