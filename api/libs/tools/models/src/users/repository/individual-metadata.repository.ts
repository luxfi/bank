import { EntityRepository } from '@mikro-orm/knex';
import { IndividualMetadata } from '../entities';

export class IndividualMetadataRepository extends EntityRepository<IndividualMetadata> {}
