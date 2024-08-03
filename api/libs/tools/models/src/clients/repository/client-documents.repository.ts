import { EntityRepository } from '@mikro-orm/knex';
import { ClientDocument } from '../entities/client-document.entity';
import { Client } from '../entities';
import { Document } from '../../documents-manager';
import { DocumentType } from '../../users';

export class ClientDocumentsRepository extends EntityRepository<ClientDocument> {
  async findByClient(clientUuid: string): Promise<ClientDocument[]> {
    return this.find({ client: { uuid: clientUuid } });
  }

  async findByDocument(document: Document): Promise<ClientDocument | null> {
    return this.findOne({ document });
  }

  async findByDocumentType(client: Client, type: DocumentType): Promise<ClientDocument | null> {
    return this.findOne({ type, client }, { populate: ['document'] });
  }

  async findByDocumentAndClient(document: Document, client: Client): Promise<ClientDocument | null> {
    return this.findOne({ document, client });
  }
}
