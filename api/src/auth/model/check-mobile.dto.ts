import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone } from 'class-validator';

export class CheckMobileDto {
    @ApiProperty()
    @IsMobilePhone()
    mobileNumber: string;

    @ApiProperty()
    verificationCode: string;
}

export class Check2FAMobileDto {
    @ApiProperty()
    verificationCode?: string;
    
    @ApiProperty()
    twoFAverificationCode?: string;
}
