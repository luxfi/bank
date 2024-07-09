import * as ApiHelpers from "../../utils/api-helpers";
import { BeneficiaryDto } from "./model/beneficiary-dto";
import { BeneficiaryResponse, CurrencyBeneficiaryResponse } from "./model/beneficiary-response";

export const review = async (data: BeneficiaryDto): Promise<any> => {
  
  const res = await ApiHelpers.fetch("/api/v1/beneficiaries/review", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const { statusCode, data: responseData, message } = await res.json();
  // console.log('response', responseData);
  if (statusCode === 200 && responseData) {
    return responseData;
  }
  
  if (message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Beneficiary couldn't be validated, please try again.");
};

export const create = async (data: BeneficiaryDto): Promise<any> => {
  const res = await ApiHelpers.fetch("/api/v1/beneficiaries", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const { statusCode, data: responseData, message } = await res.json();
  if (statusCode === 200 && responseData?.beneficiary) {
    return responseData?.beneficiary;
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Beneficiary couldn't be created, please try again.");
};

export const update = async (
  uuid: string,
  data: BeneficiaryDto
): Promise<any> => {
  const res = await ApiHelpers.fetch(`/api/v1/beneficiaries/${uuid}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const { statusCode, data: responseData, message } = await res.json();
  if (statusCode === 200 && responseData?.beneficiary) {
    return responseData?.beneficiary;
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Beneficiary couldn't be updated, please try again.");
};

export const list = async (): Promise<BeneficiaryResponse[]> => {
  const res = await ApiHelpers.fetch("/api/v1/beneficiaries", {
    method: "GET",
  });
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data?.beneficiaries || [];
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load beneficiaries, please try again.");
};
export const currency_list = async (currency: string): Promise<CurrencyBeneficiaryResponse[]> => {
  // console.log('api', currency);
  const res = await ApiHelpers.fetch(`/api/v1/currencycloud/beneficiaries/${currency}`, {
    method: "GET",
  });
  const { statusCode, data, message } = await res.json();
  
  if (statusCode === 200) {
    return data?.beneficiaries || [];
  }
  // console.log('beneficiaries', data);
  
  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load beneficiaries, please try again.");
};

export const fetch = async (uuid: string): Promise<BeneficiaryResponse> => {
  const res = await ApiHelpers.fetch(`/api/v1/beneficiaries/${uuid}`, {
    method: "GET",
  });
  // console.log('uuid', uuid);
  const { statusCode, data, message } = await res.json();
  
  if (statusCode === 200) {
    return data?.beneficiary || {};
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't load beneficiary, please try again.");
};

export const deleteBeneficiary = async (uuid: string): Promise<void> => {
  const res = await ApiHelpers.fetch(`/api/v1/beneficiaries/${uuid}`, {
    method: "DELETE",
  });
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return;
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't delete beneficiary, please try again.");
};


export const approveBeneficiary = async (uuid: string): Promise<void> => {
  const res = await ApiHelpers.fetch(`/api/v1/beneficiaries/${uuid}/approve`, {
    method: "POST",
  });
  const { statusCode, data, message } = await res.json();
  if (statusCode === 200) {
    return data?.beneficiary;
  }

  if (message && message !== "Internal server error") {
    throw new Error("Error: " + message);
  }

  throw new Error("Couldn't approve/unapprove beneficiary, please try again.");
};