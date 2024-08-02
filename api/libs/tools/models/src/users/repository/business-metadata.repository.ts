import { EntityRepository } from '@mikro-orm/postgresql';
import { BusinessMetadata } from '../entities';

export class BusinessMetadataRepository extends EntityRepository<BusinessMetadata> {}
