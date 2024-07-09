import * as yup from "yup";
import * as ApiHelpers from "../../utils/api-helpers";
import { PaymentResponse } from "../accounts/model/account-response";
import { ViewPaymentFee } from "./ViewPaymentSlice";
import {
  BeneficiaryFromResponse,
  QuoteFromResponse,
  QuotePostFromResponse,
  SplitPreviewFromResponse,
  TopPostFromResponse,
} from "./model/currencyQuote-response";

export const splitPreviewSchema = yup.object({
  id: yup.string(),
  amount: yup.string(),
});
export type SplitPreviewDto = yup.TypeOf<typeof splitPreviewSchema>;

export const editConversionSchema = yup.object({
  id: yup.string(),
  new_settlement_date: yup.string(),
});
export type EditConversionDto = yup.TypeOf<typeof editConversionSchema>;
export const split_conversion_preview = async (
  formData: SplitPreviewDto
): Promise<SplitPreviewFromResponse> => {
  const res = await ApiHelpers.fetch(
    "/api/v1/currencycloud/conversion/" + formData.id + "/split_preview",
    {
      method: "POST",
      body: JSON.stringify({ amount: formData.amount }),
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('quote',data);
  if (statusCode === 200) {
    return data;
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load balances, please try again.");
};
export const split_conversion = async (
  formData: SplitPreviewDto
): Promise<SplitPreviewFromResponse> => {
  const res = await ApiHelpers.fetch(
    "/api/v1/currencycloud/conversion/" + formData.id + "/split",
    {
      method: "POST",
      body: JSON.stringify({ amount: formData.amount }),
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('quote',data);
  if (statusCode === 200) {
    return data;
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load balances, please try again.");
};
export const edit_conversion = async (
  formData: EditConversionDto
): Promise<QuotePostFromResponse> => {
  const res = await ApiHelpers.fetch(
    "/api/v1/currencycloud/conversion/" + formData.id + "/edit",
    {
      method: "POST",
      body: JSON.stringify({
        new_settlement_date: formData.new_settlement_date,
      }),
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('quote',data);
  if (statusCode === 200) {
    return data;
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load balances, please try again.");
};
export const currencyQuoteSchema = yup.object({
  sell_currency: yup.string(),
  buy_currency: yup.string(),
  fixed_side: yup.string(),
  amount: yup.string(),
  conversion_date: yup.string(),
  term_agreement: yup.boolean(),
});
export type CurrencyConvertDto = yup.TypeOf<typeof currencyQuoteSchema>;
export const currency_quote = async (
  formData: CurrencyConvertDto
): Promise<QuotePostFromResponse> => {
  const res = await ApiHelpers.fetch("/api/v1/currencycloud/create_quote", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  const { statusCode, data, message } = await res.json();
  // console.log('quote',data);
  if (statusCode === 200) {
    return data?.quote || null;
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load balances, please try again.");
};

export const currencyTopUpMarginSchema = yup.object({
  currency: yup.string(),
  amount: yup.string(),
});
export type CurrencyTopUpDto = yup.TypeOf<typeof currencyTopUpMarginSchema>;
export const currency_topup = async (
  formData: CurrencyTopUpDto
): Promise<TopPostFromResponse[]> => {
  const res = await ApiHelpers.fetch("/api/v1/currencycloud/create_top_up", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  const { statusCode, data, message } = await res.json();
  // console.log('top up',data);
  if (statusCode === 200) {
    return data?.quote || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load top up margin, please try again.");
};

export const currencyBeneficiarySchema = yup.object({
  name: yup.string(),
  bank_account_holder_name: yup.string(),
  bank_country: yup.string(),
  currency: yup.string(),
});
export type CurrencyBeneficiaryDto = yup.TypeOf<
  typeof currencyBeneficiarySchema
>;
export const currency_beneficiary = async (
  formData: CurrencyBeneficiaryDto
): Promise<BeneficiaryFromResponse[]> => {
  const res = await ApiHelpers.fetch(
    "/api/v1/currencycloud/create_beneficiary",
    {
      method: "POST",
      body: JSON.stringify(formData),
    }
  );
  const { statusCode, data, message } = await res.json();
  // console.log('beneficiary',data);
  if (statusCode === 200) {
    return data?.quote || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load top up margin, please try again.");
};

interface CurrencyAmount {
  sell_currency: string;
  buy_currency: string;
  fixed_side: string;
  amount: string;
  conversion_date: string;
  buy_account_id?: string;
  sell_account_id?: string;
}
//FIXME??
interface PayerResponse {
  legal_entity_type: string | undefined;
  company_name: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  address: string | undefined;
  city: string | undefined;
  state_or_province: string | undefined;
  country: string | undefined;
  postcode: string | undefined;
  date_of_birth: string | undefined;
  identification_type: string | undefined;
  identification_value: string | undefined;
}
export const select_quote = async (
  formData: CurrencyAmount
): Promise<QuoteFromResponse> => {
  if (!formData.conversion_date) {
    formData.conversion_date = "today";
  }
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/load_quote/${formData.buy_account_id}/${formData.sell_account_id}/${formData.amount}/${formData.fixed_side}/${formData.conversion_date}`,
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

  throw new Error("Couldn't load balances, please try again.");
};

export const validatePaymentdata = async (data: any) => {
  if (!data.id || data.id == "") {
    delete data.id;
  }
  if (!data.conversion_id || data.conversion_id == "") {
    delete data.conversion_id;
  }
  if (!data.payer_date_of_birth || data.payer_date_of_birth == "") {
    delete data.payer_date_of_birth;
  }
  if (!data.payer_first_name || data.payer_first_name == "") {
    delete data.payer_first_name;
  }
  if (!data.payer_last_name || data.payer_last_name == "") {
    delete data.payer_last_name;
  }
  if (!data.payer_company_name || data.payer_company_name == "") {
    delete data.payer_company_name;
  }
  if (!data.payer_country || data.payer_country == "") {
    delete data.payer_country;
  }
  if (!data.payer_address || data.payer_address == "") {
    delete data.payer_address;
  }
  if (!data.payer_city || data.payer_city == "") {
    delete data.payer_city;
  }
  if (!data.payer_entity_type || data.payer_entity_type == "") {
    delete data.payer_entity_type;
  }
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/validate_payment`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.payment) {
      return response?.data?.payment;
    }
  }

  throw new Error("Validation failed.");
};
export const getPayment = async (uuid: string): Promise<PaymentResponse> => {
  // console.log('front conversion', uuid);

  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/payment/${uuid}`, {
    method: "GET",
  });
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data || [];
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load payment, please try again.");
};
export const getFeesdata = async (data: any): Promise<ViewPaymentFee[]> => {
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/get_fees`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.fees) {
      return response?.data?.fees;
    }
  }

  throw new Error("Creation failed.");
};
export const createPaymentdata = async (
  data: any
): Promise<PaymentResponse> => {
  if (!data.id || data.id == "") {
    delete data.id;
  }
  if (!data.conversion_id || data.conversion_id == "") {
    delete data.conversion_id;
  }
  if (!data.payer_date_of_birth || data.payer_date_of_birth == "") {
    delete data.payer_date_of_birth;
  }
  if (!data.payer_first_name || data.payer_first_name == "") {
    delete data.payer_first_name;
  }
  if (!data.payer_last_name || data.payer_last_name == "") {
    delete data.payer_last_name;
  }
  if (!data.payer_company_name || data.payer_company_name == "") {
    delete data.payer_company_name;
  }
  if (!data.payer_country || data.payer_country == "") {
    delete data.payer_country;
  }
  if (!data.payer_address || data.payer_address == "") {
    delete data.payer_address;
  }
  if (!data.payer_city || data.payer_city == "") {
    delete data.payer_city;
  }
  if (!data.payer_entity_type || data.payer_entity_type == "") {
    delete data.payer_entity_type;
  }
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/create_payment`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.payment) {
      return response?.data?.payment;
    }
  }

  throw new Error("Creation failed.");
};
export const updatePaymentdata = async (
  data: any
): Promise<PaymentResponse> => {
  if (!data.conversion_id || data.conversion_id == "") {
    delete data.conversion_id;
  }
  if (!data.payer_date_of_birth || data.payer_date_of_birth == "") {
    delete data.payer_date_of_birth;
  }
  if (!data.payer_first_name || data.payer_first_name == "") {
    delete data.payer_first_name;
  }
  if (!data.payer_last_name || data.payer_last_name == "") {
    delete data.payer_last_name;
  }
  if (!data.payer_company_name || data.payer_company_name == "") {
    delete data.payer_company_name;
  }
  if (!data.payer_country || data.payer_country == "") {
    delete data.payer_country;
  }
  if (!data.payer_address || data.payer_address == "") {
    delete data.payer_address;
  }
  if (!data.payer_city || data.payer_city == "") {
    delete data.payer_city;
  }
  if (!data.payer_entity_type || data.payer_entity_type == "") {
    delete data.payer_entity_type;
  }
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/edit_payment`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.payment) {
      return response?.data?.payment;
    }
  }

  throw new Error("Update failed.");
};
export const getBeneficiary = async (uuid: string) => {
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/bank_beneficiary/${uuid}`,
    { method: "GET" }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data) {
      return response?.data;
    }
  }

  throw new Error("Updating failed.");
};
export const deletePaymentdata = async (uuid: string): Promise<void> => {
  // console.log('delete', uuid);
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/delete_payment`, {
    method: "POST",
    body: JSON.stringify({ uuid }),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.payment) {
      return response?.data?.payment;
    }
  }

  throw new Error("Updating failed.");
};

export const deleteConversionData = async (uuid: string): Promise<void> => {
  // console.log('delete', uuid);
  const res = await ApiHelpers.fetch(
    `/api/v1/currencycloud/cancel_conversion`,
    { method: "POST", body: JSON.stringify({ uuid }) }
  );

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.payment) {
      return response?.data?.payment;
    }
  }

  throw new Error("Updating failed.");
};

export const getDeliveryDate = async (data: any) => {
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/delivery_date`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data) {
      return response?.data;
    }
  }

  throw new Error("Updating failed.");
};
export const getPayer = async (uuid: string) => {
  // console.log('get payer', uuid);
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/payers`, {
    method: "POST",
    body: JSON.stringify({ uuid }),
  });

  const { statusCode, data, message } = await res.json();
  // console.log('current payer', data);

  if (statusCode === 200) {
    return data || [];
  }
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load payer, please try again.");
};
