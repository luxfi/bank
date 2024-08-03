import { ApiProperty } from '@nestjs/swagger';
import { ECountryCode, ECurrencyCode } from '@cdaxfx/tools-misc';
import { IsOptional } from 'class-validator';

export class FilterBeneficiariesAccountDTO {
  @ApiProperty({ enum: ['approved', 'unapproved'] })
  @IsOptional()
  status?: string;

  @IsOptional()
  @ApiProperty({ enum: ECurrencyCode })
  currency?: string;

  @IsOptional()
  @ApiProperty({ enum: ECountryCode })
  bankCountry?: string;
}
