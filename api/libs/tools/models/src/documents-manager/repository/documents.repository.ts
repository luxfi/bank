import { EntityRepository } from '@mikro-orm/postgresql';
import { Document } from '../entities/document.entity';

export class DocumentsRepository extends EntityRepository<Document> {}
