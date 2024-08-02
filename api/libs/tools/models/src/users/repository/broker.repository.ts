import { EntityRepository } from '@mikro-orm/postgresql';
import { Broker } from '../entities';

export class BrokerRepository extends EntityRepository<Broker> {}
