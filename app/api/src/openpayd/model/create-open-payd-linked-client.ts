import { CompanyType } from '@cdaxfx/tools-models';
import { LinkedClientIdentificationType } from './identification-type.enum';
import { LinkedClientType } from './linked-client-type.enum';

export interface CreateOpenPaydLinkedClientDto {
    friendlyName: string;
    clientType: LinkedClientType;
    individual?: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        email: string;
        phone: string;
        identificationType: LinkedClientIdentificationType;
        identificationValue: string;
        address: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            country: string;
            postCode: string;
            state: string;
        };
    };
    company?: {
        registeredAddress: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            country: string;
            postCode: string;
            state: string;
        };
        tradingAddress: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            country: string;
            postCode: string;
            state: string;
        };
        registrationNumber: string;
        industrySectorType?: string;
        industrySectorValue?: string;
        companyName: string;
        companyType: CompanyType;
        contactName: string;
        phone: string;
        email: string;
    };
}

export interface UpdateOpenPaydLinkedClientDto {
    friendlyName: string;
    email: string;
    phone: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
    individualAddress?: {
        address: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            country: string;
            postCode: string;
            state: string;
        };
    };
    identificationType?: LinkedClientIdentificationType;
    identificationValue?: string;
    contactName?: string;
    companyName?: string;
    companyType?: CompanyType;
    registrationNumber?: string;
    industrySectorType?: string;
    industrySectorValue?: string;
    companyAddress?: {
        registeredAddress: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            country: string;
            postCode: string;
            state: string;
        };
        tradingAddress: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            country: string;
            postCode: string;
            state: string;
        };
    };
}
