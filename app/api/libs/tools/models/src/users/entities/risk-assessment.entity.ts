import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { RiskAssessmentDto } from '../dtos';
import { RiskAssessmentRepository } from '../repository';
import { Account } from './account.entity';
import { Document } from '@tools/models';
import * as dayjs from 'dayjs';

@Entity({ customRepository: () => RiskAssessmentRepository })
export class RiskAssessment extends BaseEntity {
  @Property({ nullable: true })
  sanction: string;
  @Property({ nullable: true })
  rating: string;
  @Property({ nullable: true })
  apply: string;
  @Property({ nullable: true })
  aml: string;
  @Property({ nullable: true })
  sanctionedJurisdiction: string;
  @Property({ nullable: true })
  highRiskJurisdiction: string;
  @Property({ nullable: true })
  thirdParty: string;
  @Property({ nullable: true })
  understood: string;
  @Property({ nullable: true })
  materialConnection: string;
  @Property({ nullable: true })
  sensitiveActivity: string;
  @Property({ nullable: true })
  volume: string;
  @Property({ nullable: true })
  transactions: string;
  @Property({ nullable: true })
  knowledge: string;
  @Property({ nullable: true })
  pep: string;
  @Property({ nullable: true })
  adverseInformation: string;
  @Property({ nullable: true })
  riskRating: string;
  @Property({ nullable: true })
  completedBy: string;
  @Property({ nullable: true })
  completionDate: Date;
  @Property({ nullable: true })
  director: string;
  @Property({ nullable: true })
  approvalDate: Date;
  @Property({ nullable: true })
  notes: string;

  @Property({ nullable: true })
  clientName: string;

  @Property({ nullable: true })
  known: string;

  @Property({ nullable: true })
  yearsKnown: string;

  @Property({ nullable: true })
  metFace: string;

  @Property({ nullable: true })
  numberOfBeneficialOwners: string;

  @Property({ nullable: true })
  applicantForBusiness: string;

  @Property({ nullable: true })
  classifyAsPep: string;

  @Property({ nullable: true })
  automaticallyHigh: string;

  @Property({ nullable: true })
  sanctionedCorporate: string;

  @Property({ nullable: true })
  highRiskCorporate: string;

  @Property({ nullable: true })
  highestRisk: string;

  @Property({ nullable: true })
  publicOrWholly: string;

  @Property({ nullable: true })
  bearer: string;

  @Property({ nullable: true })
  ownershipInfo: string;

  @Property({ nullable: true })
  clientEntityApply: string;

  @Property({ nullable: true })
  considerWhere: string;

  @Property({ nullable: true })
  principalAreaSanction: string;

  @Property({ nullable: true })
  principalAreaRisk: string;

  @Property({ nullable: true })
  principalAreaApply: string;

  @Property({ nullable: true })
  businessPurpose: string;

  @Property({ nullable: true })
  businessPurposeOptions: string;

  @Property({ nullable: true })
  highRiskActivity: string;

  @Property({ nullable: true })
  activityRegulated: string;

  @Property({ nullable: true })
  valueOfEntity: string;

  @Property({ nullable: true })
  riskRatingAssessmentCompleted: string;

  @Property({ nullable: true })
  sourceOfFoundsAreFundsAssetsComingFromA3d2: string;

  @Property({ nullable: true })
  sourceOfFoundsAreFundsAssetsComingFromA3d2Details: string;

  @Property({ nullable: true })
  completeAnyNotesRegardingRiskAssessment: string;

  @Property({ nullable: true })
  completeAssessmentCompleteByName: string;

  @Property({ nullable: true })
  completeDetail: string;

  @Property({ nullable: true })
  completeNotesRationaleToJustify: string;

  @Property({ nullable: true })
  jurisdictionIsCompanyOwnershipDirectors: string;

  @Property({ nullable: true })
  riskRatingAssessmentNotesReRationaleToJustify: string;

  @Property({ nullable: true })
  raAttachDocumentUuid: string;

  @OneToOne({ entity: () => Document, nullable: true })
  raAttachDocument: Document;

  @Property({ nullable: true })
  completeWhereApplicableNameOfDirector: string;

  @Property({ nullable: true })
  businessPurposeIfYesWhoItRegulatedBy: string;

  @Property({ nullable: true })
  nextRiskAssessment: Date;

  @Property({ nullable: true })
  residenceNationalityResidenceOfBeneficial: string;

  @Exclude()
  @ManyToOne({ entity: () => Account, nullable: true })
  account: Account;
  [EntityRepositoryType]: RiskAssessmentRepository;

  async updateFromDto(data: RiskAssessmentDto) {
    await validateOrReject(data);
    this.sanction = data.sanction;
    this.rating = data.rating;
    this.apply = data.apply;
    this.aml = data.aml;
    this.sanctionedJurisdiction = data.sanctionedJurisdiction;
    this.highRiskJurisdiction = data.highRiskJurisdiction;
    this.thirdParty = data.thirdParty;
    this.understood = data.understood;
    this.materialConnection = data.materialConnection;
    this.sensitiveActivity = data.sensitiveActivity;
    this.volume = data.volume;
    this.transactions = data.transactions;
    this.knowledge = data.knowledge;
    this.pep = data.pep;
    this.adverseInformation = data.adverseInformation;
    this.riskRating = data.riskRating;
    this.completedBy = data.completedBy;
    this.completionDate = data.completionDate;
    this.director = data.director;
    if (data.approvalDate) {
      this.approvalDate = data.approvalDate;
    }
    this.notes = data.notes;
    this.clientName = data.clientName;
    this.known = data.known;
    this.yearsKnown = data.yearsKnown;
    this.metFace = data.metFace;
    this.numberOfBeneficialOwners = data.numberOfBeneficialOwners;
    this.applicantForBusiness = data.applicantForBusiness;
    this.classifyAsPep = data.classifyAsPep;
    this.automaticallyHigh = data.automaticallyHigh;
    this.sanctionedCorporate = data.sanctionedCorporate;
    this.highRiskCorporate = data.highRiskCorporate;
    this.highestRisk = data.highestRisk;
    this.publicOrWholly = data.publicOrWholly;
    this.bearer = data.bearer;
    this.ownershipInfo = data.ownershipInfo;
    this.clientEntityApply = data.clientEntityApply;
    this.considerWhere = data.considerWhere;
    this.principalAreaSanction = data.principalAreaSanction;
    this.principalAreaRisk = data.principalAreaRisk;
    this.principalAreaApply = data.principalAreaApply;
    this.businessPurpose = data.businessPurpose;
    this.businessPurposeOptions = data.businessPurposeOptions;
    this.highRiskActivity = data.highRiskActivity;
    this.activityRegulated = data.activityRegulated;
    this.valueOfEntity = data.valueOfEntity;

    this.riskRatingAssessmentCompleted = data.riskRatingAssessmentCompleted;
    this.sourceOfFoundsAreFundsAssetsComingFromA3d2 =
      data.sourceOfFoundsAreFundsAssetsComingFromA3d2;

    this.sourceOfFoundsAreFundsAssetsComingFromA3d2Details =
      data.sourceOfFoundsAreFundsAssetsComingFromA3d2Details;

    this.completeAnyNotesRegardingRiskAssessment =
      data.completeAnyNotesRegardingRiskAssessment;
    this.completeAssessmentCompleteByName =
      data.completeAssessmentCompleteByName;
    this.completeDetail = data.completeDetail;
    this.completeNotesRationaleToJustify = data.completeNotesRationaleToJustify;
    this.jurisdictionIsCompanyOwnershipDirectors =
      data.jurisdictionIsCompanyOwnershipDirectors;
    this.riskRatingAssessmentNotesReRationaleToJustify =
      data.riskRatingAssessmentNotesReRationaleToJustify;
    this.raAttachDocumentUuid = data.raAttachDocumentUuid;
    this.completeWhereApplicableNameOfDirector =
      data.completeWhereApplicableNameOfDirector;
    this.businessPurposeIfYesWhoItRegulatedBy =
      data.businessPurposeIfYesWhoItRegulatedBy;

    this.residenceNationalityResidenceOfBeneficial =
      data.residenceNationalityResidenceOfBeneficial;

    if (data.completionDate) {
      if (data.riskRating?.toLowerCase() === 'high') {
        this.nextRiskAssessment = dayjs(data.completionDate)
          .add(12, 'month')
          .toDate();
      } else {
        this.nextRiskAssessment = dayjs(data.completionDate)
          .add(36, 'month')
          .toDate();
      }
    }
  }
}
