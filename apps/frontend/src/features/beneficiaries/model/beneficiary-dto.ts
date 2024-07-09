import * as yup from "yup";
import { initialBeneficiaryValues, initialCurrencyBeneficiaryValues } from "./beneficiary-initial-values";
import { BeneficiaryResponse, CurrencyBeneficiaryResponse } from "./beneficiary-response";
import { beneficiarySchema, currencyBeneficiarySchema } from "./beneficiary-schema";

export type BeneficiaryDto = yup.TypeOf<typeof beneficiarySchema>;
export type CurrencyBeneficiaryDto = yup.TypeOf<typeof currencyBeneficiarySchema>;
export function beneficiaryDtoFromResponse(
  response: BeneficiaryResponse
): BeneficiaryDto {
  return {
    firstname: response.firstname || initialBeneficiaryValues.firstname,
    lastname: response.lastname || initialBeneficiaryValues.lastname,
    entityType: response.entityType || initialBeneficiaryValues.entityType,
    currency: response.currency || initialBeneficiaryValues.currency,
    address: response.address || initialBeneficiaryValues.address,
    city: response.city || initialBeneficiaryValues.city,
    country: response.country || initialBeneficiaryValues.country,
    state: response.state || initialBeneficiaryValues.state,
    postcode: response.postcode || initialBeneficiaryValues.postcode,
    bankCountry: response.bankCountry || initialBeneficiaryValues.bankCountry,
    accountNumber:
      response.accountNumber || initialBeneficiaryValues.accountNumber,
    sortCode: response.sortCode || initialBeneficiaryValues.sortCode,
    IBAN: response.IBAN || initialBeneficiaryValues.IBAN,
    bicSwift: response.bicSwift || initialBeneficiaryValues.bicSwift,
    companyName: response.companyName || initialBeneficiaryValues.companyName,
  };
}


export function  currencyBeneficiaryDtoFromResponse(
  response: CurrencyBeneficiaryResponse
): CurrencyBeneficiaryDto{
  return {
      id: response.id || initialCurrencyBeneficiaryValues.id,
      bank_account_holder_name: response.bank_account_holder_name || initialCurrencyBeneficiaryValues.bank_account_holder_name,
      name: response.name || initialCurrencyBeneficiaryValues.name,
      email: response.email || initialCurrencyBeneficiaryValues.email,
      payment_types: response.payment_types || initialCurrencyBeneficiaryValues.payment_types,
      beneficiary_address: response.beneficiary_address || initialCurrencyBeneficiaryValues.beneficiary_address,
      beneficiary_country: response.beneficiary_country || initialCurrencyBeneficiaryValues.beneficiary_country,
      beneficiary_entity_type: response.beneficiary_entity_type || initialCurrencyBeneficiaryValues.beneficiary_entity_type,
      beneficiary_company_name: response.beneficiary_company_name || initialCurrencyBeneficiaryValues.beneficiary_company_name,
      beneficiary_first_name: response.beneficiary_first_name || initialCurrencyBeneficiaryValues.beneficiary_first_name,
      beneficiary_last_name: response.beneficiary_last_name || initialCurrencyBeneficiaryValues.beneficiary_last_name,
      beneficiary_city: response.beneficiary_city || initialCurrencyBeneficiaryValues.beneficiary_city,
      beneficiary_postcode: response.beneficiary_postcode || initialCurrencyBeneficiaryValues.beneficiary_postcode,
      beneficiary_state_or_province: response.beneficiary_state_or_province || initialCurrencyBeneficiaryValues.beneficiary_state_or_province,
      beneficiary_date_of_birth: response.beneficiary_date_of_birth || initialCurrencyBeneficiaryValues.beneficiary_date_of_birth,
      beneficiary_identification_type: response.beneficiary_identification_type || initialCurrencyBeneficiaryValues.beneficiary_identification_type,
      beneficiary_identification_value: response.beneficiary_identification_value || initialCurrencyBeneficiaryValues.beneficiary_identification_value,
      bank_country: response.bank_country || initialCurrencyBeneficiaryValues.bank_country,
      bank_name: response.bank_name || initialCurrencyBeneficiaryValues.bank_name,
      bank_account_type: response.bank_account_type || initialCurrencyBeneficiaryValues.bank_account_type,
      currency: response.currency || initialCurrencyBeneficiaryValues.currency,
      account_number: response.account_number || initialCurrencyBeneficiaryValues.account_number,
      routing_code_type_1: response.routing_code_type_1 || initialCurrencyBeneficiaryValues.routing_code_type_1,
      routing_code_value_1: response.routing_code_value_1 || initialCurrencyBeneficiaryValues.routing_code_value_1,
      routing_code_type_2: response.routing_code_type_2 || initialCurrencyBeneficiaryValues.routing_code_type_2,
      routing_code_value_2: response.routing_code_value_2 || initialCurrencyBeneficiaryValues.routing_code_value_2,
      bic_swift: response.bic_swift || initialCurrencyBeneficiaryValues.bic_swift,
      iban: response.iban || initialCurrencyBeneficiaryValues.iban,
      default_beneficiary: response.default_beneficiary || initialCurrencyBeneficiaryValues.default_beneficiary,
      creator_contact_id: response.creator_contact_id || initialCurrencyBeneficiaryValues.creator_contact_id,
      bank_address: response.bank_address || initialCurrencyBeneficiaryValues.bank_address,
      beneficiary_external_reference: response.beneficiary_external_reference || initialCurrencyBeneficiaryValues.beneficiary_external_reference
  };
}
