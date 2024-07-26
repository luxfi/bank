export class UserResponseDto {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    phone: string;
    status: string;
    country: string;
}

export class GetUserResponseDto {
    data: UserResponseDto;
}
