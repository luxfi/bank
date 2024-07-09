import { EntityRepository } from '@mikro-orm/mysql';
import { Director } from '../entities';

export class DirectorRepository extends EntityRepository<Director> {}
