import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { UserRole } from '../enums';

export class InvitationDto {
  @ApiProperty()
  @Length(1, 255)
  firstname: string;

  @ApiProperty()
  @Length(1, 255)
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  userRole: UserRole;

  password?: string;
}
