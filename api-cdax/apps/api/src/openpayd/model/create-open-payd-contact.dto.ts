import { ContactStatus } from './contact-status.enum';

export interface CreateOpenPaydContactDto {
    accountId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    mobilePhoneNumber?: string;
    loginId?: string;
    status?: ContactStatus;
    local?: string;
    timezone?: string;
    dateOfBirth?: string;
}
