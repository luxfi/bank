import {
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryKey,
  Cascade,
} from '@mikro-orm/core';
import { Client } from '@tools/models/clients';
import { User } from '@tools/models/users';
import { randomUUID } from 'crypto';
import { UserClientsRepository } from '../repository';
import { UserClientMetadata } from './metadata.entity';
import { map } from 'rxjs';

@Entity({
  customRepository: () => UserClientsRepository,
  tableName: 'user_clients',
})
export class UserClient {
  @PrimaryKey({ length: 36 })
  uuid: string = randomUUID();

  @ManyToOne(() => User, { joinColumn: 'user_uuid' })
  user!: User;

  @ManyToOne(() => Client, { joinColumn: 'client_uuid' })
  client!: Client;

  @OneToOne(() => UserClientMetadata, (metadata) => metadata.userClient, {
    cascade: [Cascade.ALL],
  })
  metadata!: UserClientMetadata;
}
