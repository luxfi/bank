import { EntityRepository } from '@mikro-orm/knex';
import { NewsLetter } from '../entities';

export class NewsLetterRepository extends EntityRepository<NewsLetter> {}
