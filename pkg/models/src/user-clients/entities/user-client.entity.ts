import { Entity, OneToOne, ManyToOne, PrimaryKey, Cascade } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { UserClientsRepository } from '../repository';
import { UserClientMetadata } from './metadata.entity';
import { Client } from '../../clients';
import { User } from '../../users';

@Entity({repository: () => UserClientsRepository, tableName: 'user_clients'})
export class UserClient {
  @PrimaryKey({ length: 36 })
  uuid: string = randomUUID();

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Client)
  client!: Client;

  @OneToOne(() => UserClientMetadata, (metadata) => metadata.userClient, {cascade: [Cascade.ALL],})
  metadata!: UserClientMetadata;
}
