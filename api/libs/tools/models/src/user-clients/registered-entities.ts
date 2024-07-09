import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserClient, UserClientMetadata } from './entities';

export const USER_CLIENTS_REGISTERED_ENTITIES = [
  UserClient,
  UserClientMetadata,
];

export const MikroOrmRegisteredForUserClients = () =>
  MikroOrmModule.forFeature(USER_CLIENTS_REGISTERED_ENTITIES);
