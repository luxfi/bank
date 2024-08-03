import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';
import { compareHash, generateCodeAndHash } from '@luxbank/misc';
import { BaseEntity } from '../../base';
import { InvitationDto } from '../dtos';
import { AdminRoles, UserRole } from '../enums';
import { InvitationsRepository } from '../repository';
import { Account } from './account.entity';
import { User } from './user.entity';

@Entity({ repository: () => InvitationsRepository })
export class Invitation extends BaseEntity {
  @Property()
  email: string;

  @Property()
  firstname: string;

  @Property()
  lastname: string;

  @Property()
  secret: string;

  @Property({ type: String, default: UserRole.TeamMember })
  userRole: UserRole = UserRole.TeamMember;

  @ManyToOne({ entity: () => Account, nullable: false })
  account: Account;

  @ManyToOne({ entity: () => User, nullable: false })
  creator: User;

  @Property({ nullable: true })
  expiredAt: Date;

  async generateSecret(): Promise<string> {
    const { code, hash } = await generateCodeAndHash(8);
    this.secret = hash;
    return code;
  }

  async isSecretValid(secret: string): Promise<boolean> {
    return compareHash(secret, this.secret);
  }

  expire(): void {
    this.expiredAt = new Date();
  }

  isExpired(): boolean {
    return this.expiredAt !== null;
  }

  static fromDto(data: InvitationDto, creator: User): Invitation {
    if (!AdminRoles.includes(creator.role!) && !creator.contact?.account)
      throw new BadRequestException('User account is not set up properly');

    const result = new Invitation();
    result.firstname = data.firstname;
    result.lastname = data.lastname;
    result.email = data.email;
    result.userRole = data.userRole;
    result.account = creator.contact?.account || new Account();
    result.creator = creator;
    return result;
  }

  [EntityRepositoryType]: InvitationsRepository;
}
