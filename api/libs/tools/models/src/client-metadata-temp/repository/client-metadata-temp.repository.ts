import { EntityRepository } from '@mikro-orm/mysql';
import { MetadataTemp } from '../entities/client-metadata-temp.entity';

export class ClientMetadataTemp extends EntityRepository<MetadataTemp> {}
