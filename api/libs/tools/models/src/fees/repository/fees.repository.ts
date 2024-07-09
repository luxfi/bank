import { EntityRepository } from '@mikro-orm/mysql';
import { User } from '../../users';
import { Fee } from '../entities';

export class FeesRepository extends EntityRepository<Fee> {
  async createFee(data: any, user?: User | undefined): Promise<Fee> {
    const result = new Fee();
    if (user) {
      result.updatedBy = user;
    }
    return result;
  }
  async delete(fee: Fee): Promise<Fee> {
    fee.deletedAt = new Date();
    await this.em.persistAndFlush(fee);
    return fee;
  }
}
