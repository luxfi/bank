import * as ApiHelpers from "../../utils/api-helpers";

export const approveTransactionFn = async (id: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/approve_payment/${id}`,
    {
      method: "POST",
    }
  );
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data;
  }
  throw new Error("Couldn't approve the transaction, please try again.");
};

export const rejectTransactionFn = async (id: string, reason: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/reject_payment/${id}`,
    {
      method: "POST",
      body: JSON.stringify({ description: reason }),
    }
  );

  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data;
  }
  throw new Error("Couldn't reject the transaction, please try again.");
};
