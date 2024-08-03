import { EntityRepository } from '@mikro-orm/knex';
import { Document } from '../entities/document.entity';

export class DocumentsRepository extends EntityRepository<Document> {}
