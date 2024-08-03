import { ApiProperty } from '@nestjs/swagger';
import { isInUk } from '@luxbank/misc';
import { isEmpty,  IsEnum, IsISO31661Alpha2, IsOptional, Length, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { Currencies } from '../enums';

export enum PaymentType {
  Regular = 'regular',
  Priority = 'priority'
}

enum AccountType {
  Individual = 'individual',
  Business = 'business'
}

export class CreateBeneficiaryDto {
  @ApiProperty()
  @MinLength(1)
  @ValidateIf((obj: CreateBeneficiaryDto) => obj.entityType === AccountType.Individual)
  firstname: string;

  @ApiProperty()
  @MinLength(1)
  @ValidateIf((obj: CreateBeneficiaryDto) => obj.entityType === AccountType.Individual)
  lastname: string;

  @ApiProperty()
  @IsEnum(AccountType)
  entityType: AccountType;

  @ApiProperty()
  @IsEnum(Currencies)
  currency: Currencies;

  @ApiProperty()
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType: PaymentType;

  @ApiProperty()
  @Length(1, 255)
  @ValidateIf((obj: CreateBeneficiaryDto) => obj.entityType === AccountType.Individual)
  address: string;

  @ApiProperty()
  @Length(1, 255)
  city: string;

  @ApiProperty()
  @Length(1, 255)
  state: string;

  @ApiProperty()
  @Length(1, 255)
  postcode: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  country: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  @ValidateIf((obj: CreateBeneficiaryDto) => obj.entityType === AccountType.Business)
  companyName: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  bankCountry: string;

  @ApiProperty()
  @ValidateIf((obj) => isInUk(obj.bankCountry) && obj.currency == 'GBP')
  @Matches(/^[0-9]{8}$/)
  accountNumber: string;

  @ApiProperty()
  @ValidateIf((obj) => isInUk(obj.bankCountry) && obj.currency == 'GBP')
  @Matches(/^[0-9]{6}$/)
  sortCode: string;

  @ApiProperty()
  @ValidateIf((obj) => !isEmpty(obj.IBAN))
  @Matches(/^([A-Z0-9]\s*){15,34}$/)
  IBAN?: string;

  @ApiProperty()
  @ValidateIf((obj) => !isEmpty(obj.bicSwift))
  @Matches(/^[0-9A-Z]{8}$|^[0-9A-Z]{11}$/)
  bicSwift?: string;
}
