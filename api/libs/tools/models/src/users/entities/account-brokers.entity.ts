import { Entity, EntityRepositoryType } from '@mikro-orm/core';
import { BaseEntity } from '../../base';
import { AccountBrokersRepository } from '../repository';

@Entity({ repository: () => AccountBrokersRepository })
export class AccountBrokers extends BaseEntity {
  [EntityRepositoryType]: AccountBrokersRepository;
}
