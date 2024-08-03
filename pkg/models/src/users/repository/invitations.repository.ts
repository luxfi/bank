import { EntityRepository } from '@mikro-orm/knex';
import { Invitation } from '../entities';

export class InvitationsRepository extends EntityRepository<Invitation> {}
