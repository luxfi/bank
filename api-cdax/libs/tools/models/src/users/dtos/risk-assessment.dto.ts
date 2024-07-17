import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class RiskAssessmentDto {
  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  sanction: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  rating: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  apply: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  aml: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  sanctionedJurisdiction: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  highRiskJurisdiction: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  thirdParty: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  understood: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  materialConnection: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  sensitiveActivity: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  volume: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  transactions: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  knowledge: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  pep: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  adverseInformation: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  riskRating: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  completedBy: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completionDate: Date;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  director: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  approvalDate?: Date;

  @ApiProperty()
  @IsOptional()
  notes: string;

  @ApiProperty()
  @IsOptional()
  clientName: string;

  @ApiProperty()
  @IsOptional()
  known: string;

  @ApiProperty()
  @IsOptional()
  yearsKnown: string;

  @ApiProperty()
  @IsOptional()
  metFace: string;

  @ApiProperty()
  @IsOptional()
  numberOfBeneficialOwners: string;

  @ApiProperty()
  @IsOptional()
  applicantForBusiness: string;

  @ApiProperty()
  @IsOptional()
  classifyAsPep: string;

  @ApiProperty()
  @IsOptional()
  automaticallyHigh: string;

  @ApiProperty()
  @IsOptional()
  sanctionedCorporate: string;

  @ApiProperty()
  @IsOptional()
  highRiskCorporate: string;

  @ApiProperty()
  @IsOptional()
  highestRisk: string;

  @ApiProperty()
  @IsOptional()
  publicOrWholly: string;

  @ApiProperty()
  @IsOptional()
  bearer: string;

  @ApiProperty()
  @IsOptional()
  ownershipInfo: string;

  @ApiProperty()
  @IsOptional()
  clientEntityApply: string;

  @ApiProperty()
  @IsOptional()
  considerWhere: string;

  @ApiProperty()
  @IsOptional()
  principalAreaSanction: string;

  @ApiProperty()
  @IsOptional()
  principalAreaRisk: string;

  @ApiProperty()
  @IsOptional()
  principalAreaApply: string;

  @ApiProperty()
  @IsOptional()
  businessPurpose: string;

  @ApiProperty()
  @IsOptional()
  businessPurposeOptions: string;

  @ApiProperty()
  @IsOptional()
  highRiskActivity: string;

  @ApiProperty()
  @IsOptional()
  activityRegulated: string;

  @ApiProperty()
  @IsOptional()
  valueOfEntity: string;

  @ApiProperty()
  @IsOptional()
  riskRatingAssessmentCompleted: string;

  @ApiProperty()
  @IsOptional()
  sourceOfFoundsAreFundsAssetsComingFromA3d2: string;

  @ApiProperty()
  @IsOptional()
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: string;

  @ApiProperty()
  @IsOptional()
  completeAnyNotesRegardingRiskAssessment: string;

  @ApiProperty()
  @IsOptional()
  completeAssessmentCompleteByName: string;

  @ApiProperty()
  @IsOptional()
  completeDetail: string;

  @ApiProperty()
  @IsOptional()
  completeNotesRationaleToJustify: string;

  @ApiProperty()
  @IsOptional()
  jurisdictionIsCompanyOwnershipDirectors: string;

  @ApiProperty()
  @IsOptional()
  riskRatingAssessmentNotesReRationaleToJustify: string;

  @ApiProperty()
  @IsOptional()
  raAttachDocumentUuid: string;

  @ApiProperty()
  @IsOptional()
  completeWhereApplicableNameOfDirector: string;

  @ApiProperty()
  @IsOptional()
  businessPurposeIfYesWhoItRegulatedBy: string;

  @ApiProperty()
  @IsOptional()
  residenceNationalityResidenceOfBeneficial: string;
}
