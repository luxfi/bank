import { EntityRepository } from '@mikro-orm/mysql';
import { IndividualMetadata } from '../entities';

export class IndividualMetadataRepository extends EntityRepository<IndividualMetadata> {}
