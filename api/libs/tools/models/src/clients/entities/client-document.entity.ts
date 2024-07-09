import {
  Cascade,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { ClientDocumentDto } from '@tools/models/users/dtos/client-documents.dto';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Document } from '../../documents-manager';
import { ClientDocumentsRepository } from '../repository/client-documents.repository';
import { Client } from './client.entity';
import { DocumentType } from '../../users/enums';

@Entity({ customRepository: () => ClientDocumentsRepository })
export class ClientDocument extends BaseEntity {
  @Property({ default: 0 })
  isApproved: boolean;

  @Property({ type: String })
  type: DocumentType;

  @OneToOne({ entity: () => Document, nullable: true, cascade: [Cascade.ALL] })
  document: Document;

  @Exclude()
  @ManyToOne({ entity: () => Client })
  client: Client;

  [EntityRepositoryType]: ClientDocumentsRepository;

  static create(
    document: Document,
    client: Client,
    type: DocumentType,
  ): ClientDocument {
    const clientDocument = new ClientDocument();
    clientDocument.document = document;
    clientDocument.type = type;
    clientDocument.client = client;
    clientDocument.isApproved = true;

    return clientDocument;
  }
}
