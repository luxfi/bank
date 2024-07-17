import { EntityRepository } from '@mikro-orm/postgresql';
import { Invitation } from '../entities';

export class InvitationsRepository extends EntityRepository<Invitation> {}
