import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MetadataTemp } from './entities';

export const CLIENTS_METADATA_TEMP_ENTITIES = [MetadataTemp];

export const MikroOrmRegisteredForClientsMetadataTemp = () =>
  MikroOrmModule.forFeature(CLIENTS_METADATA_TEMP_ENTITIES);
