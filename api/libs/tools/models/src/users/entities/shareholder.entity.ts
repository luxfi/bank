import { Entity, EntityRepositoryType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base';
import { ShareholderDto } from '../dtos';
import { Titles } from '../enums';
import { ShareholderRepository } from '../repository';
import { Account } from './account.entity';
import { BusinessMetadata, CompanyType } from './business-metadata.entity';
import { IndividualMetadata } from './individual-metadata.entity';

@Entity({ repository: () => ShareholderRepository })
export class Shareholder extends BaseEntity {
  @Property({ nullable: true })
  fullName: string;

  @Property({ nullable: true })
  dob: Date;

  @Property({ nullable: true })
  occupation: string;

  @Property({ nullable: true })
  telephoneNumber: string;

  @OneToOne({ entity: () => BusinessMetadata, nullable: true })
  businessMetadata: BusinessMetadata;

  @OneToOne({ entity: () => IndividualMetadata, nullable: true })
  individualMetadata: IndividualMetadata;

  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  nationality: string;

  @Property({ nullable: true })
  address1: string;

  @Property({ nullable: true })
  address2: string;

  @Property({ nullable: true })
  previousAddress1: string;

  @Property({ nullable: true })
  previousAddress2: string;

  @Property({ nullable: true })
  entityType: string;

  @Property({ nullable: true })
  country: string;

  @Property({ nullable: true })
  shares: number;

  @Exclude()
  @ManyToOne({ entity: () => Account, nullable: true })
  account: Account;

  @Property({ nullable: true })
  complyLaunchId: string;

  @Property({ nullable: true, length: 64 })
  complyLaunchResponse: string;

  [EntityRepositoryType]: ShareholderRepository;

  async updateFromDto(data: ShareholderDto) {
    if (data.account) 
      return;

    this.fullName = data.fullName;
    this.telephoneNumber = data.telephoneNumber;
    this.email = data.email;
    this.shares = data.shares;
    this.entityType = data.entityType;
    if (data.entityType?.toUpperCase() !== 'INDIVIDUAL') {
      const businessMetadata = new BusinessMetadata();
      businessMetadata.registeredOffice1 = data.address1;
      businessMetadata.registeredOffice2 = data.address2;
      businessMetadata.companyName = data.fullName;
      businessMetadata.companyType = <CompanyType>data.companyType;
      businessMetadata.previousOffice1 = data.previousAddress1;
      businessMetadata.previousOffice2 = data.previousAddress2;
      businessMetadata.countryOfRegistration = data.country;
      businessMetadata.registeredOffice1_state = data.state;
      this.businessMetadata = businessMetadata;
    } 
    else {
      const individualMetadata = new IndividualMetadata();
      individualMetadata.title = Titles.Mr;
      individualMetadata.firstname = data.fullName.split(' ')[0];
      individualMetadata.lastname = data.fullName.split(' ')[data.fullName.split(' ').length - 1];
      individualMetadata.addressLine1 = data.address1 || '';
      individualMetadata.addressLine2 = data.address2 || '';
      individualMetadata.previousAddressLine1 = data.previousAddress1;
      individualMetadata.previousAddressLine2 = data.previousAddress2;
      individualMetadata.nationality = data.nationality;
      individualMetadata.country = data.country;
      individualMetadata.occupation = data.occupation || '';
      individualMetadata.dateOfBirth = data.dob;
      individualMetadata.country = data.country;
      individualMetadata.placeOfBirth = data.nationality ?? '';
      individualMetadata.city = '';
      individualMetadata.postcode = '';
      individualMetadata.state = data.state || '';
      this.individualMetadata = individualMetadata;
    }
  }
}
