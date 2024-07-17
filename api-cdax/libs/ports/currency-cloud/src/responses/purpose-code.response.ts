export interface PurposeCodesResponse {
    purpose_codes: PurposeCode[];
}
  
export interface PurposeCode {
    bank_account_country: string;
    currency: string;
    entity_type: string;
    purpose_code: string;
    purpose_description: string;
}
  