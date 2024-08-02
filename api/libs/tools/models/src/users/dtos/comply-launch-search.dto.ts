import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsOptional } from 'class-validator';

export class ComplyLaunchSearchDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsAlpha()
  country: string;

  @ApiProperty()
  @IsOptional()
  dob: Date;
}
