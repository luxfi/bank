import { EntityRepository } from '@mikro-orm/postgresql';
import { IndividualMetadata } from '../entities';

export class IndividualMetadataRepository extends EntityRepository<IndividualMetadata> {}
