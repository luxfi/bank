import { EntityRepository } from '@mikro-orm/mysql';
import { MobileVerificationEntity } from '../model/mobile-verification.entity';

export class MobileVerificationRepository extends EntityRepository<MobileVerificationEntity> {
  private readonly VALID_FOR = 1 * 5 * 60 * 1000;

  async findRecentlyVerified(
    mobileNumber: string,
    code: string,
    ip: string,
  ): Promise<MobileVerificationEntity | null> {
    return this.findOne({
      mobileNumber,
      code,
      ip,
      createdAt: {
        $gte: new Date(new Date().getTime() - this.VALID_FOR),
        $lt: new Date(),
      },
    });
  }

  async findRecentlyVerifiedByIP(
    mobileNumber: string,
    ip: string,
  ): Promise<MobileVerificationEntity | null> {
    return this.findOne({
      mobileNumber,
      ip,
      createdAt: {
        $gte: new Date(new Date().getTime() - this.VALID_FOR),
        $lt: new Date(),
      },
    });
  }
}
