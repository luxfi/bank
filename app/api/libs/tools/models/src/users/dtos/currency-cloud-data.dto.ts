import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, Length } from 'class-validator';

export class CurrencyCloudDataDto {
  @ApiProperty()
  @IsUUID()
  contactId: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;
}

export class OpenPaydDataDto {
  @ApiProperty()
  @IsOptional()
  contactId: string;
}
