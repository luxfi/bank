import { EntityRepository } from '@mikro-orm/knex';
import { BusinessMetadata } from '../entities';

export class BusinessMetadataRepository extends EntityRepository<BusinessMetadata> {}
