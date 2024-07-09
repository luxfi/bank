import * as ApiHelpers from "../../utils/api-helpers";
import {
  AccountDataResponse,
  AccountResponse,
  ContactResponse,
  Conversion,
  SenderResponse,
  Transaction,
} from "./model/account-response";

export const account_list = async (): Promise<AccountResponse[]> => {
  const res = await ApiHelpers.fetch("/api/v1/currencycloud/accounts", {
    method: "GET",
  });
  const { statusCode, data, message } = await res.json();

  if (statusCode === 200) {
    return data?.accounts || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
export const getAccount = async (
  account_id: string
): Promise<AccountResponse> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/account/${account_id}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log(statusCode, data);

  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};

export const getTransaction = async (
  currency: string,
  settles_at_from: string,
  completed_at_from: string,
  page: number
) => {
  // console.log(currency, settles_at_from, completed_at_from, page);
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/transaction/${currency}/${settles_at_from}/${completed_at_from}/${page}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
export const getTransactionRef = async (
  short_ref: string
): Promise<Transaction> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/transactionref/${short_ref}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('transaction', statusCode, data);

  if (statusCode === 200) {
    return data?.transactions[0] || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
export const getConversion = async (uuid: string): Promise<Conversion> => {
  // console.log('front conversion', uuid);

  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/conversion/${uuid}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('conversion', statusCode, data?.conversions[0]);

  if (statusCode === 200) {
    return data || [];
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};

export const createCurrencyAccount = async (currency: string) => {
  // console.log('last frontend ', currency);
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/currencyaccount/${currency}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }
  throw new Error("Couldn't create currency account, please try again.");
};
export const contact_list = async (
  account_id: string
): Promise<ContactResponse[]> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/contacts/${account_id}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('features-account', data);

  if (statusCode === 200) {
    return data?.contacts || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
export const getContact = async (
  contact_id: string
): Promise<ContactResponse> => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/contact/${contact_id}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('contact', data);

  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
export const getSender = async (entity_id: string): Promise<SenderResponse> => {
  // console.log('sender from frontend', entity_id);
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/sender/${entity_id}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('sender from backend', data);

  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
export const settle_account_list = async (
  currency: string,
  account_id: string
): Promise<AccountDataResponse> => {
  if (!account_id.length) {
    account_id = "1";
  }
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/settle_accounts/${currency}/${account_id}`,
    {
      method: "GET",
    }
  );
  const { statusCode, data, message } = await res.json();

  if (statusCode === 200) {
    return data;
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};

export const activeCurrentAccount = async (): Promise<AccountResponse> => {
  const res = await ApiHelpers.fetch("/api/v1/currencycloud/current", {
    method: "GET",
  });
  const { statusCode, data, message } = await res.json();
  // console.log('active-account', data);

  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load accounts, please try again.");
};
