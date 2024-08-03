import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInstance, IsOptional, IsString, Length } from 'class-validator';
import { BankMetadataDto } from './bank-metadata.dto';
import { BrokerDto } from './broker.dto';
import { BusinessMetadataDto } from './business-metadata.dto';
import { DirectorDto } from './director.dto';
import { FeesDto } from '../../fees/dtos/fees.dto';
import { IndividualMetadataDto } from './individual-metadata.dto';
import { PendingMetadataDto } from './pending-metadata.dto';
import { RiskAssessmentDto } from './risk-assessment.dto';
import { ShareholderDto } from './shareholder.dto';
import { UserClientsMetadataDto } from './user-clients-metadata.dto';

export type SessionI = 'personal' | 'address' | 'employment';

export class UserMetadataDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  session?: SessionI;

  @ApiProperty({ type: UserClientsMetadataDto })
  @Type(() => UserClientsMetadataDto)
  @IsOptional()
  @IsInstance(UserClientsMetadataDto)
  userClientsMetadataDto?: UserClientsMetadataDto;

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
  bankMetadata?: BankMetadataDto;

  @ApiProperty({ type: RiskAssessmentDto })
  @Type(() => RiskAssessmentDto)
  @IsOptional()
  @IsInstance(RiskAssessmentDto)
  riskAssessment: RiskAssessmentDto;

  @ApiProperty({ type: FeesDto })
  @Type(() => FeesDto)
  @IsOptional()
  @IsInstance(FeesDto)
  fees?: FeesDto;

  @ApiProperty({ type: [] })
  @IsOptional()
  brokers: BrokerDto[];

  @ApiProperty({ type: [] })
  @IsOptional()
  directors: DirectorDto[];

  @ApiProperty({ type: [] })
  @IsOptional()
  shareholders: ShareholderDto[];

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  expectedVolumeOfTransactions: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  expectedValueOfTurnover: string;

  @ApiProperty()
  @IsOptional()
  partial: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsOptional()
  isApproved: boolean;

  pendingMetadata?: PendingMetadataDto[];
}

export class UserMetadataRejectDto extends UserMetadataDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
