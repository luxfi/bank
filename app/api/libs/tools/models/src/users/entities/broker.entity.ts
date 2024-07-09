import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { BrokerDto } from '../dtos';
import { BrokerRepository } from '../repository';
import { Account } from './account.entity';

@Entity({ customRepository: () => BrokerRepository })
export class Broker extends BaseEntity {
  @Property({ nullable: true })
  name: string;
  @Property({ nullable: true })
  address: string;
  @Property({ nullable: true })
  country: string;
  @Property({ nullable: true })
  kyc: string;
  @Property({ nullable: true })
  client: string;
  @Property({ nullable: true })
  percentageSplit: number;
  @Property({ nullable: true })
  payment: string;
  @Property({ nullable: true })
  bankAccount: string;
  @Property({ nullable: true })
  contract: string;
  @Property({ nullable: true })
  comment: string;
  @Property({ nullable: true })
  complyLaunchId: string;
  @Property({ nullable: true, length: 64 })
  complyLaunchResponse: string;

  @Exclude()
  @ManyToOne({ entity: () => Account, nullable: true })
  account: Account;

  [EntityRepositoryType]: BrokerRepository;

  async updateFromDto(data: BrokerDto) {
    await validateOrReject(data);
    this.name = data.name;
    this.address = data.address;
    this.kyc = data.kyc;
    this.client = data.client;
    this.percentageSplit = data.percentageSplit;
    this.payment = data.payment;
    this.bankAccount = data.bankAccount;
    this.contract = data.contract;
    this.comment = data.comment;
  }
}
