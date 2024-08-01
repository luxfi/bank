export class CurrentUserResponseDto {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    mobileNumber: string;
    entityType: string;
    country: string;
    currentClient: {
        uuid: string;
        name: string;
    };
}
