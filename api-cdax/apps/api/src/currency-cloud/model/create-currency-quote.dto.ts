import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, MinDate } from 'class-validator';

export class CreateCurrencyQuote {
    @ApiProperty()
    @IsOptional()
    buy_currency: string;

    @ApiProperty()
    @IsOptional()
    sell_currency: string;

    @ApiProperty()
    @IsOptional()
    fixed_side: string;

    @ApiProperty()
    @IsOptional()
    amount: string;

    @ApiProperty()
    @IsOptional()
    conversion_date: string;

    @ApiProperty()
    @IsOptional()
    term_agreement: boolean;
}

export class CreateCurrencyTopUp {
    @ApiProperty()
    @IsOptional()
    currency: string;

    @ApiProperty()
    @IsOptional()
    amount: string;
}

export class CreateCurrencyBeneficiary {
    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    bank_account_holder_name: string;

    @ApiProperty()
    @IsOptional()
    bank_country: string;

    @ApiProperty()
    @IsOptional()
    currency: string;
}

export class CreateValidatePayment {
    @ApiProperty()
    @IsOptional()
    id?: string | undefined;

    @ApiProperty()
    @IsNotEmpty()
    currency: string;

    @ApiProperty()
    @IsOptional()
    purpose_code?: string;

    @ApiProperty()
    @IsNotEmpty()
    beneficiary_id: string;

    @ApiProperty()
    @IsNotEmpty()
    amount: string;

    @ApiProperty()
    @IsNotEmpty()
    reason: string;

    @ApiProperty()
    @IsNotEmpty()
    reference: string;

    @ApiProperty()
    @IsNotEmpty()
    payment_type: string;

    @ApiProperty()
    @IsNotEmpty()
    payment_date: string;

    @ApiProperty()
    @IsOptional()
    account_id?: string;
}

export class CreateValidateConversion {
    @ApiProperty()
    @IsOptional()
    id?: string | undefined;

    @ApiProperty()
    @IsOptional()
    currency: string;

    @ApiProperty()
    @IsOptional()
    purpose_code?: string;

    @ApiProperty()
    @IsOptional()
    beneficiary_id: string;

    @ApiProperty()
    @IsOptional()
    amount: string;

    @ApiProperty()
    @IsOptional()
    reason: string;

    @ApiProperty()
    @IsOptional()
    reference: string;

    @ApiProperty()
    @IsOptional()
    payment_type: string;

    @ApiProperty()
    @IsOptional()
    payment_date: string;

    @ApiProperty()
    @IsOptional()
    conversion_id: string;

    @ApiProperty()
    @IsOptional()
    payer_entity_type: string;

    @ApiProperty()
    @IsOptional()
    payer_company_name: string;

    @ApiProperty()
    @IsOptional()
    payer_first_name: string;

    @ApiProperty()
    @IsOptional()
    payer_last_name: string;

    @ApiProperty()
    @IsOptional()
    payer_city: string;

    @ApiProperty()
    @IsOptional()
    payer_address: string;

    @ApiProperty()
    @IsOptional()
    payer_country: string;

    @ApiProperty()
    @IsOptional()
    payer_date_of_birth: string;

    @ApiProperty()
    @IsOptional()
    account_id?: string;
}

export class DeletePaymentDTO {
    @ApiProperty()
    @IsOptional()
    uuid: string;
}

export class SplitConversionDTO {
    @ApiProperty()
    @IsOptional()
    amount: string;
}

export class DateChangeDTO {
    @ApiProperty()
    @IsOptional()
    new_settlement_date: string;
}

export class DeliveryDateDTO {
    @ApiProperty()
    @IsOptional()
    currency: string;

    @ApiProperty()
    @IsOptional()
    bank_country: string;

    @ApiProperty()
    @IsOptional()
    payment_date: string;
    
    @ApiProperty()
    @IsOptional()
    payment_type: string;
}
