import { ApiProperty } from '@nestjs/swagger';
import { IsISO31661Alpha2, IsMobilePhone, IsOptional } from 'class-validator';

export class UserV2Dto {
  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  profileImage?: string;

  @ApiProperty()
  @IsMobilePhone()
  @IsOptional()
  mobileNumber?: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  @IsOptional()
  country?: string;
}
