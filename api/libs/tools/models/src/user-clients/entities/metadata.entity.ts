import { Entity, PrimaryKey, OneToOne, Property } from '@mikro-orm/core';
import { UserClient } from './user-client.entity';
import { randomUUID } from 'crypto';
import { Type } from 'class-transformer';
import { UserClientMetadataRepository } from '../repository';
import { UserRole } from '../enums';

@Entity({
  customRepository: () => UserClientMetadataRepository,
  tableName: 'user_clients_metadata',
})
export class UserClientMetadata {
  @PrimaryKey({ length: 36 })
  uuid: string = randomUUID();

  @Type(() => UserClient)
  @OneToOne({
    entity: () => UserClient,
    owner: true,
    joinColumn: 'user_client_uuid',
  })
  userClient!: UserClient;

  @Property({ type: String, default: UserRole.AdminUser })
  role: UserRole = UserRole.AdminUser;

  @Property({ type: String, nullable: true })
  phoneNumber?: string;

  @Property({ type: String, nullable: true })
  whoTheyAre?: string;
}
