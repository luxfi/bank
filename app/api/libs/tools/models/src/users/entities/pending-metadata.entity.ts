import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { BaseEntity } from '../../base';
import { PendingMetadataDto } from '../dtos';
import { PendingMetadataRepository } from '../repository';
import { Account } from './account.entity';

@Entity({ customRepository: () => PendingMetadataRepository })
export class PendingMetaData extends BaseEntity {
  @Property()
  type: string;
  @Property()
  field: string;
  @Property()
  value: string;

  @Exclude()
  @ManyToOne({ entity: () => Account, nullable: true })
  account: Account;

  [EntityRepositoryType]: PendingMetadataRepository;

  async updateFromDto(data: PendingMetadataDto) {
    await validateOrReject(data);
    this.type = data.type;
    this.field = data.field;
    this.value = data.value;
  }
}
