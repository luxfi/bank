import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Client, ClientDocument } from './entities';

export const CLIENTS_REGISTERED_ENTITIES = [Client, ClientDocument];

export const MikroOrmRegisteredForClients = () =>
  MikroOrmModule.forFeature(CLIENTS_REGISTERED_ENTITIES);
