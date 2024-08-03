import { EEntityType, RoutingCodes } from '@cdaxfx/ports-ifx';
import { ECurrencyCode } from '@cdaxfx/tools-misc';

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
