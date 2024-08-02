import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ShuftiproDto {
  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  event: string;
}
