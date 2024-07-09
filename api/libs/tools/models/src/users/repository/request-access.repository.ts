import { EntityRepository } from '@mikro-orm/mysql';
import { RequestAccess } from '../entities';

export class RequestAccessRepository extends EntityRepository<RequestAccess> {}
