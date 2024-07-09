import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../model/base.entity';
import { MobileVerificationRepository } from '../repository/mobile-verification.repository';

@Entity({ customRepository: () => MobileVerificationRepository })
export class MobileVerificationEntity extends BaseEntity {
  @Property()
  mobileNumber: string;

  @Property()
  code: string;

  @Property()
  ip: string;

  [EntityRepositoryType]: MobileVerificationRepository;

  static create(mobileNumber: string, code: string, ip: string): MobileVerificationEntity {
    const result = new MobileVerificationEntity();
    result.mobileNumber = mobileNumber;
    result.code = code;
    result.ip = ip;
    return result;
  }
}
