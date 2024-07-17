import { EntityRepository } from '@mikro-orm/postgresql';
import { RequestAccess } from '../entities';

export class RequestAccessRepository extends EntityRepository<RequestAccess> {}
