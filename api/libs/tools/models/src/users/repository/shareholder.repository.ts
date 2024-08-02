import { EntityRepository } from '@mikro-orm/postgresql';
import { Shareholder } from '../entities';

export class ShareholderRepository extends EntityRepository<Shareholder> {}
