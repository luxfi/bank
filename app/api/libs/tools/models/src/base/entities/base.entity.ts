import { PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export abstract class BaseEntity {
  @PrimaryKey({ length: 36 })
  uuid: string = randomUUID();

  @Property({ defaultRaw: 'current_timestamp' })
  createdAt: Date = new Date();

  @Property({ defaultRaw: `current_timestamp on update current_timestamp` })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt: Date;
}
