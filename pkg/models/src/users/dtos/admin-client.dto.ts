import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInstance, IsOptional } from 'class-validator';
import { BankMetadataDto } from './bank-metadata.dto';
import { BrokerDto } from './broker.dto';
import { BusinessMetadataDto } from './business-metadata.dto';
import { ClientDocumentDto } from './client-documents.dto';
import { DirectorDto } from './director.dto';
import { IndividualMetadataDto } from './individual-metadata.dto';
import { LinkUserDto } from './link-user-dto';
import { RiskAssessmentDto } from './risk-assessment.dto';
import { ShareholderDto } from './shareholder.dto';

export class AdminClientDto {
  @ApiProperty({ type: BusinessMetadataDto })
  @Type(() => BusinessMetadataDto)
  @IsOptional()
  @IsInstance(BusinessMetadataDto)
  businessMetadata?: BusinessMetadataDto;

  @ApiProperty({ type: IndividualMetadataDto })
  @Type(() => IndividualMetadataDto)
  @IsOptional()
  @IsInstance(IndividualMetadataDto)
  individualMetadata?: IndividualMetadataDto;

  @ApiProperty({ type: BankMetadataDto })
  @Type(() => BankMetadataDto)
  @IsOptional()
  @IsInstance(BankMetadataDto)
  bankMetadata: BankMetadataDto;

  @ApiProperty({ type: RiskAssessmentDto })
  @Type(() => RiskAssessmentDto)
  @IsOptional()
  @IsInstance(RiskAssessmentDto)
  riskAssessment: RiskAssessmentDto;

  @ApiProperty({ type: [LinkUserDto] })
  @Type(() => LinkUserDto)
  @IsOptional()
  @IsInstance(LinkUserDto)
  linkedUsers: LinkUserDto[];

  @ApiProperty({ type: [DirectorDto] })
  @IsArray()
  @IsOptional()
  @IsInstance(DirectorDto)
  directors: DirectorDto[];

  @ApiProperty({ type: [ShareholderDto] })
  @IsArray()
  @IsOptional()
  @IsInstance(ShareholderDto)
  shareholders: ShareholderDto[];

  @ApiProperty({ type: [BrokerDto] })
  @IsArray()
  @IsOptional()
  @IsInstance(BrokerDto)
  brokers: BrokerDto[];

  @ApiProperty({ type: [ClientDocumentDto] })
  @IsArray()
  @IsOptional()
  @IsInstance(ClientDocumentDto)
  documents: ClientDocumentDto[];

  @IsOptional()
  linkedClient?: string;

  @IsOptional()
  accountUuid: string;
}
