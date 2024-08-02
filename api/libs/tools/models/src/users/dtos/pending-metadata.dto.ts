import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class PendingMetadataDto {
  @ApiProperty()
  @Length(1, 255)
  type: string; 

  @ApiProperty()
  @Length(1, 255)
  field: string;

  @ApiProperty()
  @Length(1, 255)
  value: string;
}
