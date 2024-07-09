import { EntityRepository } from '@mikro-orm/mysql';
import { Shareholder } from '../entities';

export class ShareholderRepository extends EntityRepository<Shareholder> {}
