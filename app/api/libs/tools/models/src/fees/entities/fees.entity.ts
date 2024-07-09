import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { Account, User } from '../../users';
import { FeesDto } from '../dtos';
import { FeesRepository } from '../repository';

@Entity({ customRepository: () => FeesRepository })
export class Fee extends BaseEntity {
  @Property({ nullable: true })
  conversion_amount: string;

  @Property({ nullable: true })
  conversion_currency: string;

  @Property({ nullable: true })
  SEPA_amount: string;

  @Property({ nullable: true })
  SEPA_currency: string;

  @Property({ nullable: true })
  SEPA_INSTANT_amount: string;

  @Property({ nullable: true })
  SEPA_INSTANT_currency: string;

  @Property({ nullable: true })
  TARGET2_amount: string;

  @Property({ nullable: true })
  TARGET2_currency: string;

  @Property({ nullable: true })
  SWIFT_amount: string;

  @Property({ nullable: true })
  SWIFT_currency: string;

  @Property({ nullable: true })
  CHAPS_amount: string;

  @Property({ nullable: true })
  CHAPS_currency: string;

  @Property({ nullable: true })
  FASTER_PAYMENTS_amount: string;

  @Property({ nullable: true })
  FASTER_PAYMENTS_currency: string;

  @Property({ nullable: true })
  accountId: string;

  @Exclude()
  @ManyToOne({ entity: () => Account, nullable: true })
  account: Account;

  @Exclude()
  @ManyToOne({ entity: () => User, nullable: true })
  updatedBy: User;

  [EntityRepositoryType]: FeesRepository;
  async updateFromDto(data: FeesDto) {
    await validateOrReject(data);
    this.conversion_amount = data.conversion_amount;
    this.conversion_currency = data.conversion_currency;
    this.SEPA_amount = data.SEPA_amount;
    this.SEPA_currency = data.SEPA_currency;
    this.SEPA_INSTANT_amount = data.SEPA_INSTANT_amount;
    this.SEPA_INSTANT_currency = data.SEPA_INSTANT_currency;
    this.TARGET2_amount = data.TARGET2_amount;
    this.TARGET2_currency = data.TARGET2_currency;
    this.SWIFT_amount = data.SWIFT_amount;
    this.SWIFT_currency = data.SWIFT_currency;
    this.CHAPS_amount = data.CHAPS_amount;
    this.CHAPS_currency = data.CHAPS_currency;
    this.FASTER_PAYMENTS_amount = data.FASTER_PAYMENTS_amount;
    this.FASTER_PAYMENTS_currency = data.FASTER_PAYMENTS_currency;
  }
}
