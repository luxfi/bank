import {
  Cascade,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Type } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Account, AccountType, User } from '../../users';
import { BeneficiariesRepository } from '../repository';

@Entity({ customRepository: () => BeneficiariesRepository })
export class Beneficiary extends BaseEntity {
  @Property({ nullable: true })
  firstname: string;

  @Property({ nullable: true })
  lastname: string;

  @Property({ type: String, nullable: true })
  entityType: AccountType;

  @Property({ nullable: true })
  currency: string;

  @Property({ nullable: true })
  paymentType: string;

  @Property({ nullable: true })
  address: string;

  @Property({ nullable: true })
  addressLine2: string;

  @Property({ nullable: true })
  city: string;

  @Property({ nullable: true })
  state: string;

  @Property({ nullable: true })
  postcode: string;

  @Property({ nullable: true })
  country: string;

  @Property({ nullable: true })
  companyName: string;

  @Property({ nullable: true })
  bankName: string;

  @Property({ nullable: true })
  branchName: string;

  @Property({ nullable: true })
  bankAddress: string;

  @Property({ nullable: true })
  bankCountry: string;

  @Property({ nullable: true, length: 16 })
  accountNumber: string;

  @Property({ nullable: true, length: 18 })
  sortCode: string;

  @Property({ nullable: true })
  IBAN: string;

  @Property({ nullable: true })
  bicSwift: string;

  @Property({ nullable: true })
  complyLaunchId?: string;

  @Property({ nullable: true, length: 64 })
  complyLaunchResponse?: string;

  @Property({ nullable: true })
  currencyCloudId?: string;

  @Property({ nullable: true })
  openPaydId?: string;

  @Property({ nullable: true, default: 0 })
  isApproved?: boolean;

  @Property({ nullable: true })
  gatewayId?: string;

  @Type(() => Account)
  @ManyToOne({
    nullable: true,
    cascade: [Cascade.PERSIST],
    entity: () => Account,
  })
  account: Account;

  @ManyToOne({ entity: () => User, nullable: true })
  creator: User;

  @Property({ nullable: true })
  client_uuid: string;

  @Property({ nullable: true })
  impersonator_uuid: string;

  getName(): string {
    if (this.entityType === AccountType.Individual) {
      return this.firstname + ' ' + this.lastname;
    }

    return this.companyName;
  }

  [EntityRepositoryType]?: BeneficiariesRepository;
}
