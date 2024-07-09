import {
  EEntityType,
  RoutingCodes,
} from '@domain/use-cases/types/transaction.interface';
import { ECurrencyCode } from '@tools/misc';

export interface CreateBeneficiaryRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  entityType: EEntityType;
  currency: ECurrencyCode;
  bankCountry: string;
  routingCodes: RoutingCodes[];

  city: string;
  state: string;
  address: string;
  country: string;
  postCode: string;
  addressLine2?: string;
}
