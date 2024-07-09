import { EntityRepository } from '@mikro-orm/mysql';
import { BankMetadata } from '../entities';

export class BankMetadataRepository extends EntityRepository<BankMetadata> {}
