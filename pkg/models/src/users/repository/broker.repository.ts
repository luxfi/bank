import { EntityRepository } from '@mikro-orm/knex';
import { Broker } from '../entities';

export class BrokerRepository extends EntityRepository<Broker> {}
