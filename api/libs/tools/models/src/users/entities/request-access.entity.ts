import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../base';
import { RequestAccessDto } from '../dtos';
import { RequestAccessRepository } from '../repository';

@Entity({ customRepository: () => RequestAccessRepository })
export class RequestAccess extends BaseEntity {
  @Property()
  email: string;

  @Property()
  firstname: string;

  @Property()
  lastname: string;

  @Property()
  mobileNumber: string;

  static fromRequestAccessDto(data: RequestAccessDto): RequestAccess {
    const result = new RequestAccess();
    result.email = data.email;
    result.firstname = data.firstname;
    result.lastname = data.lastname;
    result.mobileNumber = data.mobileNumber;
    return result;
  }
}
