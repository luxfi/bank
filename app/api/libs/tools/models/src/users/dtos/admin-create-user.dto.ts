import { ApiProperty } from '@nestjs/swagger';
import { isInUk } from '@tools/misc';
import {
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsMobilePhone,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { CompanyType } from '../entities';
import { AccountType, AdminRoles, UserRole } from '../enums';

export class AdminCreateUserDto {
  @ApiProperty()
  @IsOptional()
  firstname?: string;

  @ApiProperty()
  @IsOptional()
  lastname?: string;

  @ApiProperty()
  @IsOptional()
  companyName?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEnum(AccountType)
  @ValidateIf((obj) => !AdminRoles.includes(obj.role))
  entityType: AccountType;

  @ApiProperty()
  @IsISO31661Alpha2()
  @ValidateIf((obj) => !AdminRoles.includes(obj.role))
  country: string;

  @ApiProperty()
  @IsMobilePhone()
  @ValidateIf(
    (obj: AdminCreateUserDto) =>
      !AdminRoles.includes(obj.role) && obj.isInsideUk(),
  )
  mobileNumber: string;

  @ApiProperty()
  businessRole: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: UserRole, nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: CompanyType })
  @IsOptional()
  @IsEnum(CompanyType)
  companyType: CompanyType;

  @ApiProperty()
  @IsOptional()
  verifiedAt: string;

  isInsideUk(): boolean {
    return isInUk(this.country);
  }

  @ApiProperty()
  @IsOptional()
  invitedBy: string;
}
