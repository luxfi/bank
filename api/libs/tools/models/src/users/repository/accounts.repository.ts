import { EntityRepository } from '@mikro-orm/postgresql';
import { Account } from '../entities';

export class AccountsRepository extends EntityRepository<Account> {
  async findByUUID(uuid: string): Promise<Account | null> {
    return this.findOne({ uuid, deletedAt: null }, { populate: ['contact'] });
  }
}
