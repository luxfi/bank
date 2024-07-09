import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TransactionDescriptionDto {
  @ApiProperty()
  @IsOptional()
  description: string;
}
