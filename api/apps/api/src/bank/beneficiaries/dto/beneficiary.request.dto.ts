import {
  EEntityType,
  RoutingCodes,
} from '@domain/use-cases/types/transaction.interface';
import { ECountryCode, ECurrencyCode } from '@tools/misc';
import { IsOptional, MinLength } from 'class-validator';

export class GetBeneficiaryByIdDto {
  id: string;
}

export class Address {
  city: string;
  state: string;
  address: string;
  country: string;
  postCode: string;
}

export class BankDetails {}

export class GetBeneficiaryDetailDto {
  id: string;
  name: string; // firstname + lastname || company name
  bankCountry: string;
  currency: ECurrencyCode;
  status: string; // approved, pending
  entityType: string; // individual, business
  address: Address;
  bankName: string;
  bankAddress: string;
  routingCodes: RoutingCodes[];
}

export class CreateBeneficiaryDto extends Address {
  firstName: string;
  lastName: string;
  companyName: string;
  entityType: EEntityType;
  currency: ECurrencyCode;
  bankCountry: string;
  routingCodes: RoutingCodes[];
}

export class UpdateBeneficiaryDto {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  entityType?: EEntityType;
  currency?: ECurrencyCode;
  bankCountry?: string;
  routingCodes?: RoutingCodes[];
  city?: string;
  state?: string;
  address?: string;
  country?: string;
  postCode?: string;
}

export class GetBeneficiariesSelectDto {
  @IsOptional()
  @MinLength(3)
  name?: string;
}

export class GetBeneficiariesDto {
  id?: string;
  name?: string;
  currency?: ECurrencyCode;
  bankCountry?: ECountryCode;
  status?: string;
  client?: string;
  order?: 'asc' | 'desc';
  orderBy?: 'name' | 'currency' | 'bankCountry' | 'status';
  page?: number;
  limit?: number;
}
