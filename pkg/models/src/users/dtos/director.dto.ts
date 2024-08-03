import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DirectorDto {
  @ApiProperty()
  @IsOptional()
  uuid: string;

  @ApiProperty()
  @IsOptional()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  dob: Date;

  @ApiProperty()
  @IsOptional()
  occupation: string;

  @ApiProperty()
  @IsOptional()
  telephoneNumber: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  nationality: string;

  @ApiProperty()
  @IsOptional()
  address1: string;

  @ApiProperty()
  @IsOptional()
  address2: string;

  @ApiProperty()
  @IsOptional()
  previousAddress1: string;

  @ApiProperty()
  @IsOptional()
  previousAddress2: string;

  @ApiProperty()
  @IsOptional()
  country: string;
}
