import { EntityRepository } from '@mikro-orm/knex';
import { Shareholder } from '../entities';

export class ShareholderRepository extends EntityRepository<Shareholder> {}
