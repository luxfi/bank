import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base';
import { User } from '../../users';
import { DocumentsRepository } from '../repository';

@Entity({ customRepository: () => DocumentsRepository })
export class Document extends BaseEntity {
  @Property()
  originalFilename: string;

  @Property()
  ownCloudPath: string; // Mudança aqui para refletir o caminho no S3

  @Exclude()
  @ManyToOne({ entity: () => User, nullable: true })
  creator: User;

  [EntityRepositoryType]: DocumentsRepository;

  static create(
    originalFilename: string,
    ownCloudPath: string, // Alteração no parâmetro
    creator: User,
  ): Document {
    const document = new Document();
    document.originalFilename = originalFilename;
    document.ownCloudPath = ownCloudPath; // Atualização da atribuição aqui
    document.creator = creator;

    return document;
  }
}
