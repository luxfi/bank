import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';
import { VALIDATION_LIST } from '@luxbank/misc';
import { validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { BusinessMetadataDto } from '../dtos';
import { BusinessMetadataRepository } from '../repository';

export enum CompanyType {
  LIMITED_LIABILITY = 'LIMITED_LIABILITY',
  SOLE_TRADER = 'SOLE_TRADER',
  PARTNERSHIP = 'PARTNERSHIP',
  CHARITY = 'CHARITY',
  JOINT_STOCK_COMPANY = 'JOINT_STOCK_COMPANY',
  PUBLIC_LIMITED_COMPANY = 'PUBLIC_LIMITED_COMPANY'
}

@Entity({ repository: () => BusinessMetadataRepository })
export class BusinessMetadata extends BaseEntity {
  @Property({ nullable: true })
  companyName: string;

  @Property({ nullable: true })
  tradingName: string;

  @Property({ nullable: true })
  websiteUrl: string;

  @Property({ nullable: true })
  otherContactInfo: string;

  @Property({ nullable: true })
  natureOfBusiness: string;

  @Property({ nullable: true })
  companyRegistrationNumber: string;

  @Property({ nullable: true })
  isVatRegistered: boolean;

  @Property({ nullable: true })
  vatNumber: string;

  @Property({ nullable: true })
  isPubliclyTrading: boolean;

  @Property({ nullable: true })
  stockMarketLocation: string;

  @Property({ nullable: true })
  stockMarket: string;

  @Property({ nullable: true })
  isRegulated: boolean;

  @Property({ nullable: true })
  regulatorName: string;

  @Property({ nullable: true })
  legalEntity: string;

  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  otherTradingNames: string;

  @Enum(() => CompanyType)
  companyType: CompanyType;

  @Property({ nullable: true })
  countryOfRegistration: string;

  @Property({ nullable: true })
  dateOfRegistration: string;

  @Property({ nullable: true })
  telephoneNumber: string;

  @Property({ nullable: true })
  dateOfIncorporation: string;

  @Property({ nullable: true })
  statutoryProvision: string;

  @Property({ nullable: true })
  registeredOffice1: string;

  @Property({ nullable: true })
  registeredOffice1_address2: string;

  @Property({ nullable: true })
  registeredOffice1_postcode: string;

  @Property({ nullable: true })
  registeredOffice1_city: string;

  @Property({ nullable: true })
  registeredOffice1_state: string;

  @Property({ nullable: true })
  registeredOffice2: string;

  @Property({ nullable: true })
  registeredOffice3: string;

  @Property({ nullable: true })
  principalPlace: string;

  @Property({ nullable: true })
  mailingAddress: string;

  @Property({ nullable: true })
  address1: string;

  @Property({ nullable: true })
  address2: string;

  @Property({ nullable: true })
  previousOffice1: string;

  @Property({ nullable: true })
  previousOffice2: string;

  @Property({ nullable: true })
  previousOffice3: string;

  @Property({ nullable: true })
  expectedActivity: string;

  @Property({ nullable: true })
  expectedVolume: string;

  [EntityRepositoryType]: BusinessMetadataRepository;
  getName(): string {
    return this.companyName;
  }

  async updateFromDto(data: BusinessMetadataDto, exclude = false) {
    await validateOrReject(data);
    const fields = [
      'companyName',
      'tradingName',
      'websiteUrl',
      'natureOfBusiness',
      'companyRegistrationNumber',
      'isVatRegistered',
      'vatNumber',
      'isPubliclyTrading',
      'stockMarketLocation',
      'stockMarket',
      'isRegulated',
      'regulatorName',
      'legalEntity',
      'email',
      'companyType',
      'otherTradingNames',
      'countryOfRegistration',
      'dateOfRegistration',
      'telephoneNumber',
      'dateOfIncorporation',
      'statutoryProvision',
      'registeredOffice1',
      'registeredOffice1_address2',
      'registeredOffice1_city',
      'registeredOffice1_postcode',
      'registeredOffice1_state',
      'registeredOffice2',
      'registeredOffice3',
      'principalPlace',
      'mailingAddress',
      'address1',
      'address2',
      'previousOffice1',
      'previousOffice2',
      'previousOffice3',
      'expectedActivity',
      'expectedVolume',
      'otherContactInfo',
    ];
    this.email = data.email || this.email;
    this.companyType = data.companyType || this.companyType;
    this.countryOfRegistration = data.countryOfRegistration || this.countryOfRegistration;
    this.telephoneNumber = data.telephoneNumber || this.telephoneNumber;
    for (const field of fields) {
      if (!exclude || !VALIDATION_LIST.business.includes(field))
        this[field] = data[field] ? data[field] : this[field];
    }
  }
}
