import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class UserClientsMetadataDto {
  @ApiProperty()
  @Length(1, 255)
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @Length(1, 255)
  @IsOptional()
  whoTheyAre?: string;
}
