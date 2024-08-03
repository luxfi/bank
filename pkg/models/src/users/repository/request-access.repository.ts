import { EntityRepository } from '@mikro-orm/knex';
import { RequestAccess } from '../entities';

export class RequestAccessRepository extends EntityRepository<RequestAccess> {}
