import { EntityRepository } from '@mikro-orm/knex';
import { BankMetadata } from '../entities';

export class BankMetadataRepository extends EntityRepository<BankMetadata> {}
