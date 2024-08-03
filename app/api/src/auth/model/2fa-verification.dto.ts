import { IsEnum } from 'class-validator';

enum DeliveryMethod {
    EMAIL = 'email',
    SMS = 'sms'
}

export class TwoFaCodeDto {
    @IsEnum(DeliveryMethod)
    provider: DeliveryMethod;
}

export class TwoFaCodeCheckDto {
    @IsEnum(DeliveryMethod)
    provider: DeliveryMethod;

    code: string;
}
