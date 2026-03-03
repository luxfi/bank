import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @ApiProperty()
    username: string;

    @MinLength(6)
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    r: string;
}

export class ForgotDto {
    @IsEmail()
    @ApiProperty()
    email: string;
}

export class ResetPasswordWithTokenDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    token: string;

    @MinLength(8)
    @ApiProperty()
    newPassword: string;
}
