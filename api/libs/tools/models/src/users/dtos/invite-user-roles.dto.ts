import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone } from 'class-validator';
import { UserRole } from '../enums';

export class InviteUserRolesDto {
  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  userRole: UserRole;

  @ApiProperty()
  country: string;

  @ApiProperty()
  @IsMobilePhone()
  mobileNumber: string;
}
