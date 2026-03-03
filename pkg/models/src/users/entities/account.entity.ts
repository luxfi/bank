import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { Exclude, Type } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Beneficiary } from '../../beneficiaries';
import { Fee, FeesDto } from '../../fees';
import { BankMetadataDto, BrokerDto, BusinessMetadataDto, DirectorDto, IndividualMetadataDto, PendingMetadataDto, RiskAssessmentDto, ShareholderDto } from '../dtos';
import { AccountType } from '../enums';
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
import { EPaymentProvider } from '@luxbank/misc';

@Table({ tableName: 'account', underscored: true, paranoid: true })
export class Account extends BaseEntity {
  @Column({ type: DataType.STRING, defaultValue: AccountType.Individual })
  declare entityType: AccountType;

  @ForeignKey(() => BankMetadata)
  @Column({ type: DataType.STRING(36), allowNull: true })
  declare bankMetadataUuid: string;

  @HasOne(() => BankMetadata, 'accountUuid')
  declare bankMetadata: BankMetadata;

  @ForeignKey(() => IndividualMetadata)
  @Column({ type: DataType.STRING(36), allowNull: true })
  declare individualMetadataUuid: string;

  @HasOne(() => IndividualMetadata, 'accountUuid')
  declare individualMetadata: IndividualMetadata;

  @ForeignKey(() => BusinessMetadata)
  @Column({ type: DataType.STRING(36), allowNull: true })
  declare businessMetadataUuid: string;

  @HasOne(() => BusinessMetadata, 'accountUuid')
  declare businessMetadata: BusinessMetadata;

  @Exclude()
  @HasMany(() => RiskAssessment, 'accountUuid')
  declare riskAssessments: RiskAssessment[];

  @Exclude()
  @HasMany(() => Contact, 'accountUuid')
  declare contacts: Contact[];

  @Exclude()
  @Type(() => Broker)
  @HasMany(() => Broker, 'accountUuid')
  declare brokers: Broker[];

  @Exclude()
  @HasMany(() => Director, 'accountUuid')
  declare directors: Director[];

  @Exclude()
  @HasMany(() => Shareholder, 'accountUuid')
  declare shareholders: Shareholder[];

  @Exclude()
  @HasMany(() => Beneficiary, 'accountUuid')
  declare beneficiaries: Beneficiary[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare cloudCurrencyId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare openPaydId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare gatewayId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare gateway: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare archivedAt: Date;

  @ForeignKey(() => Fee)
  @Column({ type: DataType.STRING(36), allowNull: true })
  declare feeUuid: string;

  @Exclude()
  @HasOne(() => Fee, 'accountUuid')
  declare fee: Fee;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare isApproved: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING(36), allowNull: true })
  declare usersUuid: string;

  @BelongsTo(() => User, 'usersUuid')
  declare users: User[];

  @Exclude()
  @Type(() => PendingMetaData)
  @HasMany(() => PendingMetaData, 'accountUuid')
  declare pendingMetadatas: PendingMetaData[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare credentials: string | null;

  // --- Trading Compliance Fields ---
  // Jurisdiction determines which regulatory regime applies (SEC, FCA, MAS, etc.)
  @Column({ type: DataType.STRING, allowNull: true })
  declare jurisdiction: string | null; // US, UK, EU, SG, HK, AE, JP, CH

  // Client classification for trading (maps to compliance.ClientType in cex)
  @Column({ type: DataType.STRING, allowNull: true })
  declare tradingClientType: string | null; // individual, institutional, broker_dealer

  // KYC level for trading (0=none, 1=basic, 2=standard/ID verified, 3=enhanced/accredited)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  declare kycLevel: number;

  // Investor accreditation status
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare accredited: boolean; // US: SEC accredited investor ($1M+ net worth or $200K+ income)

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare professional: boolean; // UK/EU: MiFID II professional client / SG: MAS accredited (S$2M+ net assets)

  // AML/Sanctions status
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare amlCleared: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare sanctioned: boolean;

  // Investor profile for offering-specific limits (e.g., Reg CF annual limits)
  @Column({ type: DataType.DOUBLE, allowNull: true })
  declare annualIncome: number | null; // USD equivalent

  @Column({ type: DataType.DOUBLE, allowNull: true })
  declare netWorth: number | null; // USD equivalent

  // Trading limits
  @Column({ type: DataType.DOUBLE, allowNull: true })
  declare maxOrderSize: number | null;

  @Column({ type: DataType.DOUBLE, allowNull: true })
  declare dailyTradingLimit: number | null;

  // PEP / EDD fields
  @Column({ type: DataType.STRING, allowNull: true })
  declare pepStatus: string | null; // direct, related, former

  @Column({ type: DataType.DATE, allowNull: true })
  declare pepReviewedAt: Date | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare sourceOfFunds: string | null; // employment, investments, inheritance, business, pension, other

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare sofVerified: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare adverseMedia: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare highRiskCountry: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare eddRequired: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  declare taxResidency: string | null; // ISO country for CRS/FATCA

  getPaymentProvider() {
    return this.gateway;
  }

  getRecentRiskAssessment(): RiskAssessment {
    return (this.riskAssessments || []).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0];
  }

  async setFees(data: FeesDto) {
    this.fee = Fee.build() as Fee;
    this.fee.accountId = this.openPaydId || '';
    await this.fee.updateFromDto(data);
  }

  async setBankMetadata(data: BankMetadataDto) {
    if (!this.bankMetadata)
      this.bankMetadata = BankMetadata.build() as BankMetadata;

    await this.bankMetadata.updateFromDto(data);
  }

  async setIndividualMetadata(data: IndividualMetadataDto, exclude = false) {
    if (this.entityType !== AccountType.Individual)
      throw new Error("Account type and metadata type don't match");

    if (!this.individualMetadata)
      this.individualMetadata = IndividualMetadata.build() as IndividualMetadata;

    await this.individualMetadata.updateFromDto(data, exclude);
  }

  async setBusinessMetadata(data: BusinessMetadataDto, exclude = false) {
    if (this.entityType !== AccountType.Business)
      throw new Error("Account type and metadata type don't match");

    if (!this.businessMetadata)
      this.businessMetadata = BusinessMetadata.build() as BusinessMetadata;

    await this.businessMetadata.updateFromDto(data);
  }

  async setNewRiskAssessments(data: RiskAssessmentDto) {
    const newRiskAssessment = RiskAssessment.build() as RiskAssessment;
    await newRiskAssessment.updateFromDto(data);
    if (!this.riskAssessments) this.riskAssessments = [];
    this.riskAssessments.push(newRiskAssessment);
    return newRiskAssessment;
  }

  async setRiskAssessments(data: RiskAssessmentDto) {
    const newRiskAssessment = RiskAssessment.build() as RiskAssessment;
    if (this.riskAssessments) {
      this.riskAssessments = this.riskAssessments.filter((ele) => {
        const date2 = new Date(ele.updatedAt);
        const date1 = new Date();
        return !(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
      });
    } else {
      this.riskAssessments = [];
    }
    newRiskAssessment.updateFromDto(data);
    this.riskAssessments.push(newRiskAssessment);
  }

  async setBrokers(data: BrokerDto[]) {
    const oldBrokers = this.brokers || [];
    const newBrokers: Broker[] = [];
    for (const broker of data) {
      const newBroker = !broker.uuid
        ? Broker.build() as Broker
        : oldBrokers.find((ob) => ob.uuid === broker.uuid) || Broker.build() as Broker;
      newBroker.updateFromDto(broker);
      newBrokers.push(newBroker);
    }
    this.brokers = newBrokers;
  }

  async setDirectors(data: DirectorDto[]) {
    const oldDirectors = this.directors || [];
    const newDirectors: Director[] = [];
    for (const director of data) {
      const newDirector = !director.uuid
        ? Director.build() as Director
        : oldDirectors.find((od) => od.uuid === director.uuid) || Director.build() as Director;
      await newDirector.updateFromDto(director);
      newDirectors.push(newDirector);
    }
    this.directors = newDirectors;
  }

  async setShareholders(data: ShareholderDto[]) {
    const oldShareholders = this.shareholders || [];
    const newShareholders: Shareholder[] = [];
    for (const shareholder of data) {
      const newShareholder = !shareholder.uuid
        ? Shareholder.build() as Shareholder
        : oldShareholders.find((os) => os.uuid === shareholder.uuid) || Shareholder.build() as Shareholder;
      newShareholder.updateFromDto(shareholder);
      newShareholders.push(newShareholder);
    }
    this.shareholders = newShareholders;
  }

  async setPendingData(data: PendingMetadataDto[]) {
    const pendingMetas: PendingMetaData[] = [];
    const oldPendingMetas = this.pendingMetadatas || [];
    for (const metadata of data) {
      const newMetadata = oldPendingMetas.find((om) => om.field === metadata.field && om.type === metadata.type) || PendingMetaData.build() as PendingMetaData;
      newMetadata.updateFromDto(metadata);
      pendingMetas.push(newMetadata);
    }
    this.pendingMetadatas = pendingMetas;
  }
}
