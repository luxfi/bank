import { EntityRepository } from '@mikro-orm/mysql';
import { NewsLetter } from '../entities';

export class NewsLetterRepository extends EntityRepository<NewsLetter> {}
