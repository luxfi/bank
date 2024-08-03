import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class LinkedUserDto {
  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiProperty()
  @IsOptional()
  uuid: string;

  @ApiProperty()
  @IsOptional()
  linked_user_uuid: string;

  @ApiProperty()
  @IsOptional()
  role: string;

  @ApiProperty()
  @IsOptional()
  country: string;
}
