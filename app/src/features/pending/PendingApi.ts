import * as ApiHelpers from "../../utils/api-helpers";

export const pendingTransactionsGet = async (query: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/search/pending${query}`,
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
