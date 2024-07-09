import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../model/base.entity';
import { SessionsRepository } from '../repository/sessions.repository';

@Entity({ customRepository: () => SessionsRepository })
export class Session extends BaseEntity {
  @Property({ nullable: true })
  ip: string;

  @Property({ nullable: true })
  userAgent: string;

  @Property({ nullable: true })
  fingerprint: string;

  @Property({ nullable: true })
  type: string;

  @Property({ nullable: true })
  username: string;

  [EntityRepositoryType]: SessionsRepository;
}
