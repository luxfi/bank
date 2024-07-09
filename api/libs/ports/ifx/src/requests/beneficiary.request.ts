import { IfxEntityType } from '@domain/use-cases/types/transaction.interface';

export interface Beneficiary {
  id?: string;
  firstNames?: string;
  lastName?: string;
  name?: string;
  type: IfxEntityType;
  uniqueReference: string;
  phone?: string;
  email?: string;
  address: Address;
}

export interface BeneficiaryUpdate {
  firstNames?: string;
  lastName?: string;
  name?: string;
  uniqueReference?: string;
  phone?: string;
  email?: string;
  address?: Address;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  buildingName?: string;
  city?: string;
  postcode?: string;
  country: string;
}
