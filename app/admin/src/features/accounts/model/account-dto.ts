import * as yup from "yup";
import { initialAccountValues, initialContactValues, initialSettleAccountValues } from "./account-initial-value";
import { AccountResponse, ContactResponse, SettleAccountResponse } from "./account-response";
import { accountSchema, contactSchema, settleAccountSchema } from "./account-schema";
export type AccountDto = yup.TypeOf<typeof accountSchema>
export type ContactDto = yup.TypeOf<typeof contactSchema>
export type SettleAccountDto = yup.TypeOf<typeof settleAccountSchema>
export function accountDtoFromResponse(response: AccountResponse): AccountDto {
  return {
    id: response.id || initialAccountValues.id,
    account_name: response.account_name || initialAccountValues.account_name,
    brand: response.brand || initialAccountValues.brand,
    your_reference: response.your_reference || initialAccountValues.your_reference,
    status: response.status || initialAccountValues.status,
    street: response.street || initialAccountValues.street,
    city: response.city || initialAccountValues.city,
    state_or_province: response.state_or_province || initialAccountValues.state_or_province,
    country: response.country || initialAccountValues.country,
    postal_code: response.postal_code || initialAccountValues.postal_code,
    spread_table: response.spread_table || initialAccountValues.spread_table,
    legal_entity_type: response.legal_entity_type || initialAccountValues.legal_entity_type,
    identification_type: response.identification_type || initialAccountValues.identification_type,
    identification_value: response.identification_value || initialAccountValues.identification_value,
    short_reference: response.short_reference || initialAccountValues.short_reference,
    api_trading: response.api_trading || initialAccountValues.api_trading,
    online_trading: response.online_trading || initialAccountValues.online_trading,
    phone_trading: response.phone_trading || initialAccountValues.phone_trading,
    process_third_party_funds: response.process_third_party_funds || initialAccountValues.process_third_party_funds,
    settlement_type: response.settlement_type || initialAccountValues.settlement_type,
    agent_or_reliance: response.agent_or_reliance || initialAccountValues.agent_or_reliance,
    terms_and_conditions_accepted: response.terms_and_conditions_accepted || initialAccountValues.terms_and_conditions_accepted,
    bank_account_verified: response.bank_account_verified || initialAccountValues.bank_account_verified,
    cloudCurrencyId: response.cloudCurrencyId || initialAccountValues.cloudCurrencyId,
    openPaydId: response.openPaydId || initialAccountValues.openPaydId,
    isApproved: response.isApproved || initialAccountValues.isApproved,
  }
}
export function contactDtoFromResponse(response: ContactResponse): ContactDto {
  return {
    login_id: response.login_id || initialContactValues.login_id,
    id: response.id || initialContactValues.id,
    first_name: response.first_name || initialContactValues.first_name,
    last_name: response.last_name || initialContactValues.last_name,
    account_id: response.account_id || initialContactValues.account_id,
    account_name: response.account_name || initialContactValues.account_name,
    status: response.status || initialContactValues.status,
    locale: response.locale || initialContactValues.locale,
    timezone: response.timezone || initialContactValues.timezone,
    email_address: response.email_address || initialContactValues.email_address,
    mobile_phone_number: response.mobile_phone_number || initialContactValues.mobile_phone_number,
    phone_number: response.phone_number || initialContactValues.phone_number,
    your_reference: response.your_reference || initialContactValues.your_reference,
    date_of_birth: response.date_of_birth || initialContactValues.date_of_birth,
    account: response.account || initialAccountValues,
    complyLaunchId: response.complyLaunchId || initialContactValues.complyLaunchId,
  }
}
export function settleAccountDtoFromResponse(response: SettleAccountResponse): SettleAccountDto {
  return {
    login_id: response.login_id || initialSettleAccountValues.login_id,
    id: response.id || initialSettleAccountValues.id,
    first_name: response.first_name || initialSettleAccountValues.first_name,
    last_name: response.last_name || initialSettleAccountValues.last_name,
    account_id: response.account_id || initialSettleAccountValues.account_id,
    account_name: response.account_name || initialSettleAccountValues.account_name,
    status: response.status || initialSettleAccountValues.status,
    locale: response.locale || initialSettleAccountValues.locale,
    timezone: response.timezone || initialSettleAccountValues.timezone,
    email_address: response.email_address || initialSettleAccountValues.email_address,
    mobile_phone_number: response.mobile_phone_number || initialSettleAccountValues.mobile_phone_number,
    phone_number: response.phone_number || initialSettleAccountValues.phone_number,
    your_reference: response.your_reference || initialSettleAccountValues.your_reference,
    date_of_birth: response.date_of_birth || initialSettleAccountValues.date_of_birth,
    bank_account_holder_name: response.bank_account_holder_name || initialSettleAccountValues.bank_account_holder_name,
    beneficiary_address: response.beneficiary_address || initialSettleAccountValues.beneficiary_address,
    beneficiary_country: response.beneficiary_country || initialSettleAccountValues.beneficiary_country,
    bank_name: response.bank_name || initialSettleAccountValues.bank_name,
    bank_address: response.bank_address || initialSettleAccountValues.bank_address,
    bank_country: response.bank_country || initialSettleAccountValues.bank_country,
    currency: response.currency || initialSettleAccountValues.currency,
    bic_swift: response.bic_swift || initialSettleAccountValues.bic_swift,
    iban: response.iban || initialSettleAccountValues.iban,
    account_number: response.account_number || initialSettleAccountValues.account_number,
    routing_code_type_1: response.routing_code_type_1 || initialSettleAccountValues.routing_code_type_1,
    routing_code_value_1: response.routing_code_value_1 || initialSettleAccountValues.routing_code_value_1,
    routing_code_type_2: response.routing_code_type_2 || initialSettleAccountValues.routing_code_type_2,
    routing_code_value_2: response.routing_code_value_2 || initialSettleAccountValues.routing_code_value_2,
  }
}
