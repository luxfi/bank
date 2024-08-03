import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterBeneficiariesDTO {
  @ApiProperty({ enum: ['approved', 'unapproved'] })
  @IsOptional()
  status?: string;

  @IsOptional()
  currency?: string;

  @IsOptional()
  bank_country?: string;
}
