import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Document } from './entities';

export const DOCUMENTS_MANAGER_REGISTERED_ENTITIES = [Document];

export const MikroOrmRegisteredForDocumentsManager = () =>
  MikroOrmModule.forFeature(DOCUMENTS_MANAGER_REGISTERED_ENTITIES);
