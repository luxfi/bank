import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CompanyType } from '../entities';
import { BusinessMetadataDto } from './business-metadata.dto';
import { IndividualMetadataDto } from './individual-metadata.dto';

export class ShareholderDto {
  @ApiProperty()
  @IsOptional()
  uuid?: string;

  @ApiProperty()
  @IsOptional()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  dob: Date;

  @ApiProperty()
  @IsOptional()
  occupation: string;

  @ApiProperty()
  @IsOptional()
  telephoneNumber: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  nationality: string;

  @ApiProperty()
  entityType: string;

  @ApiProperty()
  @IsOptional()
  companyType?: CompanyType;

  @ApiProperty()
  businessMetadata?: BusinessMetadataDto;

  @ApiProperty()
  individualMetadata?: IndividualMetadataDto;

  @ApiProperty()
  @IsOptional()
  address1: string;

  @ApiProperty()
  @IsOptional()
  addressLine1: string;

  @ApiProperty()
  @IsOptional()
  addressLine2: string;

  @ApiProperty()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsOptional()
  address2: string;

  @ApiProperty()
  @IsOptional()
  previousAddress1: string;

  @ApiProperty()
  @IsOptional()
  previousAddress2: string;

  @ApiProperty()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsOptional()
  shares: number;

  @ApiProperty()
  @IsOptional()
  account: object;
}
