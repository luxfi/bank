import { RoutingCodes } from '@cdaxfx/ports-ifx';
import { ECountryCode } from '@cdaxfx/tools-misc';
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
