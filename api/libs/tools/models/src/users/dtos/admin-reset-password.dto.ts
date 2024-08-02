/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class AdminResetPasswordDto {
  @ApiProperty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])(?=.{8,})/,
    {
      message:'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
    }
  )
  newPassword: string;
  
  @ApiProperty()
  confirmPassword: string;
}
