import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsISO31661Alpha2,
  IsOptional,
  Length,
  ValidateIf,
} from 'class-validator';
import { GenderType, IdentificationType, Titles } from '../enums';

export class IndividualMetadataDto {
  @ApiProperty({ enum: Titles })
  @IsEnum(Titles)
  @IsOptional()
  title: Titles;

  @ApiProperty()
  @Length(1, 255)
  @IsOptional()
  firstname: string;

  @ApiProperty()
  @Length(1, 255)
  @IsOptional()
  lastname: string;

  @ApiProperty()
  formerName: string;

  @ApiProperty()
  otherName: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  placeOfBirth: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  addressLine1: string;

  @ApiProperty()
  @Length(0, 255)
  @IsOptional()
  addressLine2: string;

  @ApiProperty()
  @Length(0, 255)
  @IsOptional()
  city: string;

  @ApiProperty()
  @Length(0, 255)
  @IsOptional()
  postcode: string;

  @ApiProperty()
  @Length(0, 255)
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  country: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  previousAddressLine1: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  previousAddressLine2: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  previousCity: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  previousPostcode: string;

  @ApiProperty()
  @IsOptional()
  @IsISO31661Alpha2()
  @ValidateIf((obj) => obj.length > 0)
  previousCountry: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  previousState: string;

  @ApiProperty()
  @IsOptional()
  @IsISO31661Alpha2()
  @ValidateIf((obj) => obj.length > 0)
  nationality: string;

  @ApiProperty({ enum: GenderType })
  @IsEnum(GenderType)
  @IsOptional()
  @ValidateIf((obj) => obj.length > 0)
  gender: GenderType = GenderType.Other;

  @ApiProperty()
  @IsOptional()
  @ValidateIf((obj) => obj.identificationType !== IdentificationType.None)
  @Length(0, 255)
  identificationNumber: string;

  @ApiProperty({ enum: IdentificationType })
  @IsEnum(IdentificationType)
  identificationType: IdentificationType = IdentificationType.None;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  occupation: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  employerName: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  employerAddress1: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  employerAddress2: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  employerAddress3: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  publicPosition: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  highProfilePosition: string;
}
