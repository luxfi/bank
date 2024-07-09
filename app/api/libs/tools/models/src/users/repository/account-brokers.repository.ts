import { EntityRepository } from '@mikro-orm/mysql';
import { AccountBrokers } from '../entities';

export class AccountBrokersRepository extends EntityRepository<AccountBrokers> {}
