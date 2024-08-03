import { RoutingCodes } from '@luxbank/ports-ifx';
import { ECountryCode } from '@luxbank/tools-misc';
import { PaginationsResponse } from '../../get-transactions';

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
