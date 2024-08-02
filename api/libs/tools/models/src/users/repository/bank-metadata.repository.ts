import { EntityRepository } from '@mikro-orm/postgresql';
import { BankMetadata } from '../entities';

export class BankMetadataRepository extends EntityRepository<BankMetadata> {}
