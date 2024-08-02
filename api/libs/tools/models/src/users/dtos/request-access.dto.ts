import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, Length } from 'class-validator';

export class RequestAccessDto {
  @ApiProperty()
  @Length(1, 255)
  firstname: string;

  @ApiProperty()
  @Length(1, 255)
  lastname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsMobilePhone()
  mobileNumber: string;
}
