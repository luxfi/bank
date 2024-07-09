import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsISO31661Alpha2,
  IsOptional,
  Length,
  ValidateIf,
} from 'class-validator';

export class PendingMetadataDto {
  @ApiProperty()
  @Length(1, 255)
  type: string;         //Type of the meta - individual, business, bank
  
  @ApiProperty()
  @Length(1, 255)
  field: string;        //name of the filed
  
  @ApiProperty()
  @Length(1, 255)
  value: string;
}
