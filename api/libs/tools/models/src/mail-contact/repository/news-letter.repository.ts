import { EntityRepository } from '@mikro-orm/postgresql';
import { NewsLetter } from '../entities';

export class NewsLetterRepository extends EntityRepository<NewsLetter> {}
