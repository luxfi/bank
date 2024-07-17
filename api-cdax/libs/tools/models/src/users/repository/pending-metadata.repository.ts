import { EntityRepository } from '@mikro-orm/postgresql';
import { PendingMetaData } from '../entities';

export class PendingMetadataRepository extends EntityRepository<PendingMetaData> {}
