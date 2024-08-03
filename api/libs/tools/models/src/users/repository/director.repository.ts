import { EntityRepository } from '@mikro-orm/knex';
import { Director } from '../entities';

export class DirectorRepository extends EntityRepository<Director> {}
