import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

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
