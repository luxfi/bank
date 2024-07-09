import { EntityRepository } from '@mikro-orm/mysql';
import { BusinessMetadata } from '../entities';

export class BusinessMetadataRepository extends EntityRepository<BusinessMetadata> {}
