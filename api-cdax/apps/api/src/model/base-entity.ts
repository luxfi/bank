import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryKey({ length: 36 })
    uuid: string = v4();

    @Property({ defaultRaw: 'current_timestamp' })
    createdAt: Date = new Date();

    @Property({ defaultRaw: `current_timestamp on update current_timestamp` })
    updatedAt: Date = new Date();

    @Property({ nullable: true })
    deletedAt: Date;
}
