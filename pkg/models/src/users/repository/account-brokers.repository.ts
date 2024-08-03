import { EntityRepository } from '@mikro-orm/knex';
import { AccountBrokers } from '../entities';

export class AccountBrokersRepository extends EntityRepository<AccountBrokers> {}
