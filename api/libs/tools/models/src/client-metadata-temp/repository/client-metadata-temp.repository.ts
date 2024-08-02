import { EntityRepository } from '@mikro-orm/postgresql';
import { MetadataTemp } from '../entities/client-metadata-temp.entity';

export class ClientMetadataTemp extends EntityRepository<MetadataTemp> {}
