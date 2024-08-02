import { EntityRepository } from '@mikro-orm/postgresql';
import { AccountBrokers } from '../entities';

export class AccountBrokersRepository extends EntityRepository<AccountBrokers> {}
