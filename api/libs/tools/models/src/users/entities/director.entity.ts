import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import * as moment from 'moment';
import { BaseEntity } from '../../base';
import { DirectorDto } from '../dtos';
import { DirectorRepository } from '../repository';
import { Account } from './account.entity';

@Entity({ customRepository: () => DirectorRepository })
export class Director extends BaseEntity {
  @Property({ nullable: true })
  fullName: string;

  @Property({ nullable: true })
  dob: Date;

  @Property({ nullable: true })
  occupation: string;

  @Property({ nullable: true })
  telephoneNumber: string;

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
  country: string;

  @Exclude()
  @ManyToOne({ entity: () => Account, nullable: true })
  account: Account;

  @Property({ nullable: true })
  complyLaunchId: string;

  @Property({ nullable: true, length: 64 })
  complyLaunchResponse: string;

  [EntityRepositoryType]: DirectorRepository;

  async updateFromDto(data: DirectorDto) {
    await validateOrReject(data);
    this.fullName = data.fullName;
    this.dob = new Date(moment(data.dob).format('YYYY-MM-DD'));
    this.occupation = data.occupation;
    this.telephoneNumber = data.telephoneNumber;
    this.email = data.email;
    this.nationality = data.nationality;
    this.address1 = data.address1;
    this.address2 = data.address2;
    this.previousAddress1 = data.previousAddress1;
    this.previousAddress2 = data.previousAddress2;
    this.country = data.country;
  }
}
