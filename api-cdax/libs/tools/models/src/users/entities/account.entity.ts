import { Cascade, Collection, Entity, EntityRepositoryType, Enum, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { Exclude, Type } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Beneficiary } from '../../beneficiaries';
import { Fee, FeesDto } from '../../fees';
import { BankMetadataDto, BrokerDto, BusinessMetadataDto, DirectorDto, IndividualMetadataDto, PendingMetadataDto, RiskAssessmentDto, ShareholderDto } from '../dtos';
import { AccountType } from '../enums';
import { AccountsRepository } from '../repository';
import { BankMetadata } from './bank-metadata.entity';
import { Broker } from './broker.entity';
import { BusinessMetadata } from './business-metadata.entity';
import { Contact } from './contact.entity';
import { Director } from './director.entity';
import { IndividualMetadata } from './individual-metadata.entity';
import { PendingMetaData } from './pending-metadata.entity';
import { RiskAssessment } from './risk-assessment.entity';
import { Shareholder } from './shareholder.entity';
import { User } from './user.entity';
import { EPaymentProvider } from '@cdaxfx/tools-misc';

@Entity({ repository: () => AccountsRepository })
export class Account extends BaseEntity {
  @Property({ type: String, default: AccountType.Individual })
  entityType: AccountType;

  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  bankMetadata: BankMetadata;

  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  individualMetadata?: IndividualMetadata;

  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  businessMetadata?: BusinessMetadata;

  @Exclude()
  @OneToMany(() => RiskAssessment, (riskAssessment) => riskAssessment.account, {
    mappedBy: 'account',
  })
  riskAssessments = new Collection<RiskAssessment>(this);

  @Exclude()
  @OneToMany(() => Contact, (contact) => contact.account, {
    mappedBy: 'account',
  })
  contact = new Collection<Contact>(this);

  @Exclude()
  @Type(() => Broker)
  @OneToMany(() => Broker, (broker) => broker.account, {
    mappedBy: 'account',
  })
  brokers = new Collection<Broker>(this);

  @Exclude()
  @OneToMany(() => Director, (director) => director.account, {
    mappedBy: 'account',
  })
  directors = new Collection<Director>(this);

  @Exclude()
  @OneToMany(() => Shareholder, (shareholder) => shareholder.account, {
    mappedBy: 'account',
  })
  shareholders = new Collection<Shareholder>(this);

  @Exclude()
  @OneToMany(() => Beneficiary, (beneficiary) => beneficiary.account, {
    mappedBy: 'account',
  })
  beneficiaries = new Collection<Beneficiary>(this);

  @Property({ nullable: true })
  cloudCurrencyId?: string;

  @Property({ nullable: true })
  openPaydId?: string;

  @Property({ nullable: true })
  gatewayId?: string;

  @Property({ nullable: true })
  @Enum(() => EPaymentProvider)
  gateway?: string;

  @Property({ nullable: true })
  archivedAt: Date;

  @Exclude()
  @OneToOne({ nullable: true, owner: true, cascade: [Cascade.ALL] })
  fee: Fee;

  @Property({ nullable: true, default: 0 })
  isApproved: boolean;

  @Property({ type: User, nullable: true, persist: false })
  users: User[];

  @Exclude()
  @Type(() => PendingMetaData)
  @OneToMany(() => PendingMetaData, (pendingMetadata) => pendingMetadata.account, {
    mappedBy: 'account',
  })
  pendingMetadatas = new Collection<PendingMetaData>(this);

  @Property({ nullable: true })
  credentials?: string | null;

  getPaymentProvider() {
    return this.gateway;
  }

  getRecentRiskAssessment(): RiskAssessment {
    return this.riskAssessments.getItems().sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0];
  }

  async setFees(data: FeesDto) {
    this.fee = new Fee();
    this.fee.accountId = this.openPaydId || '';
    await this.fee.updateFromDto(data);
  }

  async setBankMetadata(data: BankMetadataDto) {
    if (!this.bankMetadata)
      this.bankMetadata = new BankMetadata();

    await this.bankMetadata.updateFromDto(data);
  }

  async setIndividualMetadata(data: IndividualMetadataDto, exclude = false) {
    if (this.entityType !== AccountType.Individual)
      throw new Error("Account type and metadata type don't match");

    if (!this.individualMetadata)
      this.individualMetadata = new IndividualMetadata();
    
    await this.individualMetadata.updateFromDto(data, exclude);
  }

  async setBusinessMetadata(data: BusinessMetadataDto, exclude = false) {
    if (this.entityType !== AccountType.Business)
      throw new Error("Account type and metadata type don't match");

    if (!this.businessMetadata)
      this.businessMetadata = new BusinessMetadata();
    
    await this.businessMetadata.updateFromDto(data);
  }

  async setNewRiskAssessments(data: RiskAssessmentDto) {
    const newRiskAssessment = new RiskAssessment();

    await newRiskAssessment.updateFromDto(data);
    this.riskAssessments.add(newRiskAssessment);

    return newRiskAssessment;
  }

  async setRiskAssessments(data: RiskAssessmentDto) {
    const newRiskAssessment = new RiskAssessment();
    Object.values(this.riskAssessments).forEach((ele, index) => {
      const date2 = new Date(ele.updatedAt);
      const date1 = new Date();
      if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate())
        this.riskAssessments.remove(ele);
    });
    newRiskAssessment.updateFromDto(data);
    this.riskAssessments.add(newRiskAssessment);
  }

  async setBrokers(data: BrokerDto[]) {
    const oldBrokers = await this.brokers.loadItems();
    const newBrokers: Broker[] = [];
    const savingData = data.map(async (broker) => {
      const newBroker = !broker.uuid ? new Broker() : oldBrokers.find((oldBroker) => oldBroker.uuid == broker.uuid) || new Broker();
      newBroker.updateFromDto(broker);
      newBrokers.push(newBroker);
    });
    await Promise.all(savingData);
    this.brokers.set(newBrokers);
  }

  async setDirectors(data: DirectorDto[]) {
    const oldDirectors = await this.directors.loadItems();
    const newDirectors: Director[] = [];
    const savingData = data.map(async (director) => {
      const newDirector = !director.uuid ? new Director() : oldDirectors.find((oldDirector) => oldDirector.uuid == director.uuid) || new Director();
      await newDirector.updateFromDto(director);
      newDirectors.push(newDirector);
    });
    await Promise.all(savingData);
    this.directors.set(newDirectors);
  }

  async setShareholders(data: ShareholderDto[]) {
    const oldShareholders = await this.shareholders.loadItems();
    const newShareholders: Shareholder[] = [];
    const savingData = data.map(async (shareholder) => {
      const newShareholder = !shareholder.uuid ? new Shareholder() : oldShareholders.find((oldShareholder) => oldShareholder.uuid == shareholder.uuid) || new Shareholder();
      newShareholder.updateFromDto(shareholder);
      newShareholders.push(newShareholder);
    });
    await Promise.all(savingData);
    this.shareholders.set(newShareholders);
  }

  async setPendingData(data: PendingMetadataDto[]) {
    const pendingMetas: PendingMetaData[] = [];
    const oldPendingMetas = await this.pendingMetadatas.loadItems();
    const savingData = data.map(async (metadata) => {
      const newMetadata = oldPendingMetas.find((oldMeta) => oldMeta.field == metadata.field && oldMeta.type == metadata.type) || new PendingMetaData();
      newMetadata.updateFromDto(metadata);
      pendingMetas.push(newMetadata);
    });
    await Promise.all(savingData);
    this.pendingMetadatas.set(pendingMetas);
  }

  [EntityRepositoryType]: AccountsRepository;
}
