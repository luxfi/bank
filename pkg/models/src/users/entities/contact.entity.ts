import { Cascade, Entity, EntityRepositoryType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Exclude, Type } from 'class-transformer';
import { BaseEntity } from '../../base';
import { BankMetadataDto, BrokerDto, BusinessMetadataDto, DirectorDto, IndividualMetadataDto, RiskAssessmentDto, ShareholderDto } from '../dtos';
import { ContactsRepository } from '../repository';
import { Account } from './account.entity';
import { BankMetadata } from './bank-metadata.entity';
import { IndividualMetadata } from './individual-metadata.entity';
import { Invitation } from './invitation.entity';
import { User } from './user.entity';

@Entity({ repository: () => ContactsRepository })
export class Contact extends BaseEntity {
  @Exclude()
  @Property({ nullable: true })
  cloudCurrencyId?: string;

  @Exclude()
  @Property({ nullable: true })
  openPaydId?: string;

  @Property({ nullable: true })
  businessRole?: string;

  @Property()
  country: string;

  @Property({ nullable: true })
  mobileNumber?: string;

  @Property({ default: false })
  isApproved: boolean;

  @Property({ nullable: true })
  expectedVolumeOfTransactions: string;

  @Property({ nullable: true })
  expectedValueOfTurnover: string;

  @Property({ default: false })
  isSubAccount: boolean;

  @Property({ nullable: true })
  complyLaunchId?: string;

  @Property({ nullable: true, length: 64 })
  complyLaunchResponse?: string;

  @Property({ nullable: true })
  currencyCloudPasswordUrl?: string;

  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  bankMetadata: BankMetadata;

  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  individualMetadata: IndividualMetadata;

  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  invitation: Invitation;

  @Exclude()
  @OneToOne(() => User, (user) => user.contact)
  user: User;

  @Type(() => Account)
  @ManyToOne({nullable: true, cascade: [Cascade.PERSIST], entity: () => Account})
  account: Account;

  doesRequireVerification(): boolean {
    return false;
  }

  async setBankMetadata(data: BankMetadataDto) {
    if (!this.isSubAccount && this.account) {
      await this.account.setBankMetadata(data);
      return;
    }

    if (!this.bankMetadata)
      this.bankMetadata = new BankMetadata();

    await this.bankMetadata.updateFromDto(data);
  }

  async setRiskAssessment(data: RiskAssessmentDto) {
    if (!this.isSubAccount && this.account) {
      await this.account.setRiskAssessments(data);
      return;
    }
  }

  async setBrokers(data: BrokerDto[]) {
    if (!this.isSubAccount && this.account) {
      await this.account.setBrokers(data);
      return;
    }
  }

  async setDirectors(data: DirectorDto[]) {
    if (!this.isSubAccount && this.account) {
      await this.account.setDirectors(data);
      return;
    }
  }

  async setShareholders(data: ShareholderDto[]) {
    if (!this.isSubAccount && this.account) {
      await this.account.setShareholders(data);
      return;
    }
  }

  async setIndividualMetadata(data: IndividualMetadataDto, exclude = false) {
    if (!this.isSubAccount && this.account)
      await this.account.setIndividualMetadata(data, exclude);

    if (!this.individualMetadata)
      this.individualMetadata = new IndividualMetadata();

    await this.individualMetadata.updateFromDto(data, exclude);
  }

  async setBusinessMetadata(data: BusinessMetadataDto, exclude = false) {
    await this.account.setBusinessMetadata(data, exclude);
  }

  [EntityRepositoryType]: ContactsRepository;
}
