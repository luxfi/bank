import { EntityRepository } from '@mikro-orm/postgresql';
import { Director } from '../entities';

export class DirectorRepository extends EntityRepository<Director> {}
