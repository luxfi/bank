import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  Length,
  ValidateIf,
} from 'class-validator';
import { CompanyType } from '../entities';

export class BusinessMetadataDto {
  @ApiProperty()
  @Length(1, 255)
  companyName: string;

  @ApiProperty()
  @IsOptional()
  tradingName: string;

  @ApiProperty()
  @IsOptional()
  @Length(1, 255)
  websiteUrl: string;

  @ApiProperty()
  @IsOptional()
  otherContactInfo: string;

  @ApiProperty()
  // @Length(1, 255)
  @IsOptional()
  natureOfBusiness: string;

  @ApiProperty()
  @Length(1, 255)
  @IsOptional()
  companyRegistrationNumber: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVatRegistered: boolean;

  @ApiProperty()
  @ValidateIf((obj) => obj.isVatRegistered)
  @Length(1, 255)
  @IsOptional()
  vatNumber: string;

  @ApiProperty()
  @IsEnum(CompanyType)
  @IsOptional()
  companyType: CompanyType;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPubliclyTrading: boolean;

  @ApiProperty()
  @ValidateIf((obj) => obj.isPubliclyTrading)
  @Length(1, 255)
  @IsOptional()
  stockMarketLocation: string;

  @ApiProperty()
  @ValidateIf((obj) => obj.isPubliclyTrading)
  @Length(1, 255)
  @IsOptional()
  stockMarket: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isRegulated: boolean;

  @ApiProperty()
  @ValidateIf((obj) => obj.isRegulated)
  @Length(1, 255)
  @IsOptional()
  regulatorName: string;

  @ApiProperty()
  @IsOptional()
  legalEntity: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  otherTradingNames: string;

  @ApiProperty()
  countryOfRegistration: string;

  @ApiProperty()
  @IsOptional()
  dateOfRegistration: string;

  @ApiProperty()
  @IsOptional()
  telephoneNumber: string;

  @ApiProperty()
  @IsOptional()
  dateOfIncorporation: string;

  @ApiProperty()
  @IsOptional()
  statutoryProvision: string;

  @ApiProperty()
  registeredOffice1: string;

  @ApiProperty()
  registeredOffice1_address2: string;

  @ApiProperty()
  registeredOffice1_city: string;

  @ApiProperty()
  registeredOffice1_postcode: string;

  @ApiProperty()
  registeredOffice1_state: string;

  @ApiProperty()
  registeredOffice2: string;

  @ApiProperty()
  registeredOffice3: string;

  @ApiProperty()
  principalPlace: string;

  @ApiProperty()
  mailingAddress: string;

  @ApiProperty()
  address1: string;

  @ApiProperty()
  address2: string;

  @ApiProperty()
  previousOffice1: string;

  @ApiProperty()
  previousOffice2: string;

  @ApiProperty()
  previousOffice3: string;

  @IsOptional()
  @Length(0, 255)
  @ApiProperty()
  expectedActivity: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  expectedVolume: string;
}
