import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class BrokerDto {
  @ApiProperty()
  @IsOptional()
  uuid: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  name: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  address: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  kyc: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  client: string;

  @ApiProperty()
  @IsOptional()
  percentageSplit: number;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  payment: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  bankAccount: string;

  @ApiProperty()
  @IsOptional()
  @Length(0, 255)
  contract: string;

  @ApiProperty()
  @IsOptional()
  comment: string;

  @ApiProperty()
  @IsOptional()
  country: string;
}
