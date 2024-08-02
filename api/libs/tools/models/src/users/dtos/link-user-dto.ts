import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Contact } from '../entities';
import { UserRole } from '../enums';

export class LinkUserDto {
  @ApiProperty({ uniqueItems: true })
  username: string;

  @Exclude()
  password: string;

  @Exclude()
  ip: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  @IsOptional()
  profileImage: string;

  @ApiProperty()
  hasAcceptedTerms: boolean;

  @ApiProperty({ type: Date })
  @IsOptional()
  archivedAt: Date;

  @ApiProperty()
  @IsOptional()
  invitedBy: string;

  @Exclude()
  verificationCode: string;

  @Exclude()
  verifiedAt: Date;

  @ApiProperty()
  verified: boolean;

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  role: UserRole;

  @ApiProperty()
  @Expose({ groups: ['contacts'] })
  @Type(() => Contact)
  @IsOptional()
  contact?: Contact;

  @Exclude()
  twoFASecret: string;

  @ApiProperty()
  twoFA: boolean;

  @ApiProperty()
  is2FAOK: boolean;

  @ApiProperty()
  isMobile2FAEnabled: boolean;

  @ApiProperty({ type: Date })
  passwordUpdatedAt: Date;

  @Exclude()
  personatedBy: string;
}
