import { RoutingCodes } from '@domain/use-cases/types/transaction.interface';
import { ECountryCode } from '@tools/misc';

export interface PaginationsResponse {
  totalEntries: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface ViewDetailResponse {
  accountHolderName: string;
  bankName: string;
  bankAddress: string;
  bankCountryCode: ECountryCode;
  bankCountryName: string;
  routingCodes: RoutingCodes[];
}

export interface ViewPaginatedDetailResponse {
  data: ViewDetailResponse[];
  pagination: PaginationsResponse;
}
