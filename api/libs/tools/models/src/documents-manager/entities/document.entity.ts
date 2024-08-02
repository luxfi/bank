import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base';
import { User } from '../../users';
import { DocumentsRepository } from '../repository';

@Entity({ repository: () => DocumentsRepository })
export class Document extends BaseEntity {
  @Property()
  originalFilename: string;

  @Property()
  ownCloudPath: string;

  @Exclude()
  @ManyToOne({ entity: () => User, nullable: true })
  creator: User;

  [EntityRepositoryType]: DocumentsRepository;

  static create(originalFilename: string, ownCloudPath: string, creator: User): Document {
    const document = new Document();
    document.originalFilename = originalFilename;
    document.ownCloudPath = ownCloudPath;
    document.creator = creator;

    return document;
  }
}
