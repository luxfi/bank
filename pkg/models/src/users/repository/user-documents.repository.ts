import { EntityRepository } from '@mikro-orm/knex';
import { DocumentType } from '../enums';
import { UserDocument, User } from '../entities';

export class UserDocumentsRepository extends EntityRepository<UserDocument> {
  async findByUser(user: User): Promise<UserDocument[]> {
    return this.find({ user });
  }

  async removeUserDocument(user: User, type: DocumentType): Promise<void> {
    const qb = this.createQueryBuilder();
    qb.delete({ user, type });
    await qb.execute();
  }
}
