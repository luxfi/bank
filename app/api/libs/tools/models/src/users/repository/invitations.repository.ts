import { EntityRepository } from '@mikro-orm/mysql';
import { Invitation } from '../entities';

export class InvitationsRepository extends EntityRepository<Invitation> {}
