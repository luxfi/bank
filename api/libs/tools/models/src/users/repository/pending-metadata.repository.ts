import { EntityRepository } from '@mikro-orm/knex';
import { PendingMetaData } from '../entities';

export class PendingMetadataRepository extends EntityRepository<PendingMetaData> {}
