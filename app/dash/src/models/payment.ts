import { EnumEntityType } from './entityType';

export interface IPayment {
  id: string;
  amount: string;
  beneficiary_id: string;
  currency: string;
  reference: string;
  reason: string;
  status: string;
  creator_contact_id: string;
  payment_type: string;
  payment_date: string;
  transferred_at: string;
  authorisation_steps_required: string;
  last_updater_contact_id: string;
  short_reference: string;
  conversion_id: string;
  failure_reason: string;
  payer_id: string;
  payer_details_source: string;
  created_at: string;
  updated_at: string;
  payment_group_id: string;
  unique_request_id: string;
  failure_returned_amount: string;
  ultimate_beneficiary_name: string;
  purpose_code: string;
  charge_type: string;
  fee_amount: string;
  fee_currency: string;
  review_status: string;
  invoice_date: string;
  invoice_number: string;
  status_approval: 'pending' | 'done' | 'rejected';
  beneficiary: IBeneficiary;
  payer: IPayer;
  bank: IBank;
}

export interface IPayer {
  first_name: string;
  last_name: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  firstname: string;
  lastname: string;
  legal_entity_type: string;
  formerName: string;
  otherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousPostcode: string;
  previousCountry: string;
  previousState: string;
  nationality: string;
  gender: string;
  identificationNumber: string;
  identificationType: string;
  occupation: string;
  employerName: string;
  employerAddress1: string;
  employerAddress2: string;
  employerAddress3: string;
  publicPosition: string;
  highProfilePosition: string;
  deletedAt: string;
  company_name: string;
}
interface IBeneficiary {
  id: string;
  bank_account_holder_name: string;
  name: string;
  email: string;
  payment_types: string[];
  beneficiary_address: string[];
  beneficiary_country: string;
  beneficiary_entity_type: 'individual' | 'business';
  beneficiary_company_name: string;
  beneficiary_first_name: string;
  beneficiary_last_name: string;
  beneficiary_city: string;
  beneficiary_postcode: string;
  beneficiary_state_or_province: string;
  beneficiary_date_of_birth: string;
  beneficiary_identification_type: string;
  beneficiary_identification_value: string;
  bank_country: string;
  bank_name: string;
  bank_account_type: string;
  currency: string;
  account_number: string;
  routing_code_type_1: string;
  routing_code_value_1: string;
  routing_code_type_2: string;
  routing_code_value_2: string;
  bic_swift: string;
  iban: string;
  default_beneficiary: string;
  creator_contact_id: string;
  bank_address: string[];
  business_nature: string;
  company_website: string;
  created_at: string;
  updated_at: string;
  beneficiary_external_reference: string;
}
interface IBank {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  bankName: string;
  branch: string;
  bankCountry: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  IBAN: string;
  bicSwift: string;
  currency: string;
  deletedAt: string;
}

export type TRoutingCode =
  | 'iban'
  | 'bic swift'
  | 'account number'
  | 'sort code';
export interface ITransactionDetails {
  type: 'payment' | 'conversion';
  paymentType: string;
  status: 'pending' | 'done' | 'rejected' | 'expired';
  shortId: string;
  createDate: string;
  settlementDate: string;
  paymentDate: string;
  isPendingApproval: boolean;
  in: {
    currency: string;
    amount: string;
  };
  out: {
    currency: string;
    amount: string;
  };

  creator: {
    name: string;
    email: string;
  };
  conversion?: {
    conversionRate: string;
    exchangeRateDate: string;
    conversionDate: string;
  };
  payment: {
    cdaxId?: string;
    reason: string;
    paymentReference: string;
    payer: {
      name: string;
      country: string;
    };
    beneficiary: {
      name: string;
      entityType: EnumEntityType;
      address: string;
      city: string;
    };
    beneficiaryBank: {
      country: string;
      routingCodes: Array<{ name: TRoutingCode; value: string }>;
    };
  };
}

//V2
export interface ICreatePaymentRequest {
  accountId: string;
  currency: string;
  beneficiaryId: string;
  amount: number;
  date: string;
  reference: string;
  reason: string;
  type: string;
  purposeCode: string;
}
