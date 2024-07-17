import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Fee } from './entities';

export const FEES_REGISTERED_ENTITIES = [Fee];

export const MikroOrmRegisteredForFees = () =>
  MikroOrmModule.forFeature(FEES_REGISTERED_ENTITIES);
