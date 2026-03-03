import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Account, AccountType, BankMetadataDto, BrokerDto, BusinessMetadataDto, DirectorDto, IndividualMetadataDto, RiskAssessmentDto, ShareholderDto, User, UserRole } from '../../users';
import { UserClient } from '../../user-clients';
import { ClientDocument } from './client-document.entity';

@Table({ tableName: 'client', underscored: true, paranoid: true })
export class Client extends BaseEntity {
  @ForeignKey(() => Account)
  @Column({ type: DataType.STRING(36), allowNull: true })
  declare accountUuid: string;

  @Type(() => Account)
  @HasOne(() => Account, 'clientUuid')
  declare account: Account;

  @Type(() => User)
  @BelongsToMany(() => User, () => UserClient)
  declare users: User[];

  @Exclude()
  @Column({ type: DataType.VIRTUAL, defaultValue: false })
  declare isSubAccount: boolean;

  @Exclude()
  @Column({ type: DataType.VIRTUAL })
  declare name: string;

  @Exclude()
  @HasMany(() => UserClient, 'clientUuid')
  declare userClients: UserClient[];

  @HasMany(() => ClientDocument, 'clientUuid')
  declare documents: ClientDocument[];

  @Expose({ name: 'metadata' })
  getMetadataByUser(uuid: string) {
    return this.userClients?.find((uc) => uc.userUuid === uuid)?.metadata;
  }

  getAccountName() {
    return this.account?.entityType == AccountType.Individual
      ? this.account?.individualMetadata?.getName()
      : this.account?.businessMetadata?.getName();
  }

  getCoutry() {
    return this.account?.entityType == AccountType.Individual
      ? this.account?.individualMetadata?.country
      : this.account?.businessMetadata?.countryOfRegistration;
  }

  getJurisdiction(): string {
    return this.account?.jurisdiction || this.inferJurisdiction();
  }

  // Infer regulatory jurisdiction from client's country when not explicitly set.
  private inferJurisdiction(): string {
    const country = this.getCoutry()?.toUpperCase();
    if (!country) return 'US'; // default

    // US territories
    if (['US', 'PR', 'VI', 'GU', 'AS', 'MP'].includes(country)) return 'US';
    // Isle of Man — home jurisdiction (Crown Dependency, own FSA)
    if (country === 'IM') return 'IM';
    // UK and Crown Dependencies (GG, JE route to UK FCA oversight)
    if (['GB', 'UK', 'GG', 'JE'].includes(country)) return 'UK';
    // Singapore
    if (country === 'SG') return 'SG';
    // Hong Kong
    if (country === 'HK') return 'HK';
    // UAE
    if (country === 'AE') return 'AE';
    // Japan
    if (country === 'JP') return 'JP';
    // Switzerland
    if (country === 'CH') return 'CH';
    // Australia
    if (country === 'AU') return 'AU';
    // Canada
    if (country === 'CA') return 'CA';
    // South Korea
    if (country === 'KR') return 'KR';
    // India
    if (country === 'IN') return 'IN';
    // Brazil
    if (country === 'BR') return 'BR';
    // Mexico
    if (country === 'MX') return 'MX';
    // Gibraltar
    if (country === 'GI') return 'GI';
    // Liechtenstein
    if (country === 'LI') return 'LI';

    // MENA
    if (country === 'SA') return 'SA'; // Saudi Arabia
    if (country === 'BH') return 'BH'; // Bahrain
    if (country === 'QA') return 'QA'; // Qatar
    if (country === 'KW') return 'KW'; // Kuwait
    if (country === 'OM') return 'OM'; // Oman
    if (country === 'JO') return 'JO'; // Jordan

    // Africa
    if (country === 'ZA') return 'ZA'; // South Africa
    if (country === 'NG') return 'NG'; // Nigeria
    if (country === 'KE') return 'KE'; // Kenya
    if (country === 'MU') return 'MU'; // Mauritius

    // Caribbean OFCs
    if (country === 'KY') return 'KY'; // Cayman Islands
    if (country === 'BM') return 'BM'; // Bermuda
    if (country === 'BS') return 'BS'; // Bahamas

    // EU member states
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    ];
    if (euCountries.includes(country)) return 'EU';

    return 'US'; // fallback for unrecognized
  }

  getTradingComplianceStatus() {
    return {
      accountId: this.account?.uuid,
      jurisdiction: this.getJurisdiction(),
      clientType: this.account?.tradingClientType || 'individual',
      kycLevel: this.account?.kycLevel || 0,
      accredited: this.account?.accredited || false,
      professional: this.account?.professional || false,
      amlCleared: this.account?.amlCleared || false,
      sanctioned: this.account?.sanctioned || false,
      maxOrderSize: this.account?.maxOrderSize || 0,
      dailyLimit: this.account?.dailyTradingLimit || 0,
      annualIncome: this.account?.annualIncome || 0,
      netWorth: this.account?.netWorth || 0,
      // PEP / EDD
      pepStatus: this.account?.pepStatus || null,
      pepReviewedAt: this.account?.pepReviewedAt || null,
      sourceOfFunds: this.account?.sourceOfFunds || null,
      sofVerified: this.account?.sofVerified || false,
      adverseMedia: this.account?.adverseMedia || false,
      highRiskCountry: this.account?.highRiskCountry || false,
      eddRequired: this.account?.eddRequired || false,
      taxResidency: this.account?.taxResidency || null,
    };
  }

  setName() {
    if (!this.account)
      this.name = '';

    if (!this.name) {
      this.name = this.account?.individualMetadata
        ? `${this.account?.individualMetadata?.firstname} ${this.account.individualMetadata?.lastname}`
        : this.account?.businessMetadata
        ? this.account?.businessMetadata?.companyName
        : '';
    }
  }

  getOwner(): User | undefined {
    return this.userClients?.find((uc) => uc.metadata?.role === UserRole.AdminUser)?.user;
  }

  @Expose({ name: 'accountType' })
  getAccountType() {
    if (!this.account)
      return '';
    return this.account.entityType;
  }

  async setBankMetadata(data: BankMetadataDto) {
    if (!this.isSubAccount && this.account) {
      await this.account.setBankMetadata(data);
      return;
    }
  }

  async setNewRiskAssessment(data: RiskAssessmentDto) {
    return this.account?.setNewRiskAssessments(data);
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
  }

  async setBusinessMetadata(data: BusinessMetadataDto, exclude = false) {
    await this.account?.setBusinessMetadata(data, exclude);
  }

  static fromAdminDto(data: any) {
    const client = Client.build() as Client;
    if (data.account)
      client.account = data.account;
    return client;
  }

  static fromUser(user: Partial<User>, account: Account): Client {
    return Client.build({ account }) as Client;
  }
}
