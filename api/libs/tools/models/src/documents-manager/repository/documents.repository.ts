import { EntityRepository } from '@mikro-orm/mysql';
import { Document } from '../entities/document.entity';

export class DocumentsRepository extends EntityRepository<Document> {}
