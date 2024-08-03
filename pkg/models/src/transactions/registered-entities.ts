import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Transaction } from './entities';

export const TRANSACTION_REGISTERED_ENTITIES = [Transaction];

export const MikroOrmRegisteredForTransaction = () =>
  MikroOrmModule.forFeature(TRANSACTION_REGISTERED_ENTITIES);
