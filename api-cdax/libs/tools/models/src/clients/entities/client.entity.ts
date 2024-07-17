import {Collection, Entity, ManyToMany, OneToMany, OneToOne, Property} from '@mikro-orm/core';
import { Exclude, Expose, Type } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Account, AccountType, BankMetadataDto, BrokerDto, BusinessMetadataDto, DirectorDto, IndividualMetadataDto, RiskAssessmentDto, ShareholderDto, User, UserRole} from '../../users';
import { ClientsRepository } from '../repository';
import { UserClient } from '../../user-clients';
import { ClientDocument } from './client-document.entity';

@Entity({ repository: () => ClientsRepository })
export class Client extends BaseEntity {
  @Type(() => Account)
  @OneToOne({nullable: true,owner: true, entity: () => Account})
  account?: Account;

  @Type(() => User)
  @ManyToMany({entity: () => User, mappedBy: 'clients', pivotTable: 'user_clients'})
  users = new Array<User>();

  @Exclude()
  @Property({ default: 0, persist: false })
  isSubAccount: boolean;

  @Exclude()
  @Property({ persist: false })
  name: string;

  @Exclude()
  @OneToMany(() => UserClient, (uc) => uc.client)
  userClients = new Collection<UserClient>(this);

  @OneToMany(() => ClientDocument, (cd) => cd.client)
  documents = new Collection<ClientDocument>(this);

  @Expose({ name: 'metadata' })
  getMetadataByUser(uuid: string) {
    return this.userClients.getItems().find((uc) => uc.user.uuid === uuid)?.metadata;
  }

  getAccountName() {
    return this.account?.entityType == AccountType.Individual ? this.account?.individualMetadata?.getName() : this.account?.businessMetadata?.getName();
  }

  getCoutry() {
    return this.account?.entityType == AccountType.Individual ? this.account?.individualMetadata?.country : this.account?.businessMetadata?.countryOfRegistration;
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
    return this.userClients?.getItems().find((uc) => uc.metadata.role === UserRole.AdminUser)?.user;
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
    const client = new Client();
    if (data.account)
      client.account = data.account;

    return client;
  }

  constructor(data?: any) {
    super();

    if (!!data.account) 
      this.account = data.account;
  }

  static fromUser(user: Partial<User>, account: Account): Client {
    return new Client({ user, account });
  }
}
