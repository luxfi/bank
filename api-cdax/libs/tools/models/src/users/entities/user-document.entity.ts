import { Entity, EntityRepositoryType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base';
import { Document } from '../../documents-manager';
import { UserDocumentDto } from '../dtos';
import { DocumentType } from '../enums';
import { UserDocumentsRepository } from '../repository';
import { User } from './user.entity';

@Entity()
export class UserDocument extends BaseEntity {
  @Property({ default: 0 })
  isApproved: boolean;

  @Property({ nullable: true })
  status: string;

  @Property({ type: String })
  type: DocumentType;

  @OneToOne({ entity: () => Document, nullable: true })
  document: Document;

  @Exclude()
  @ManyToOne({ entity: () => User })
  user: User;

  [EntityRepositoryType]: UserDocumentsRepository;

  static create(document: Document, owner: User, dto: UserDocumentDto): UserDocument {
    const userDocument = new UserDocument();
    userDocument.document = document;
    userDocument.type = dto.type;
    userDocument.user = owner;
    userDocument.isApproved = false;
    userDocument.status = 'pending';

    return userDocument;
  }
}
