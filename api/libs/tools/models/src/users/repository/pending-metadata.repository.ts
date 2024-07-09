import { EntityRepository } from '@mikro-orm/mysql';
import { PendingMetaData } from '../entities';

export class PendingMetadataRepository extends EntityRepository<PendingMetaData> {}
