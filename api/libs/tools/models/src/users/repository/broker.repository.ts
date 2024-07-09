import { EntityRepository } from '@mikro-orm/mysql';
import { Broker } from '../entities';

export class BrokerRepository extends EntityRepository<Broker> {}
