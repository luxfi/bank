import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AdminCreateSuperUserDto {
  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  country: string;
}
