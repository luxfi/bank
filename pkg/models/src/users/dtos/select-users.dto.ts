import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums';

export class SelectUsersDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 100;

  @ApiProperty({ enum: UserRole })
  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  roles: UserRole[];

  @ApiProperty({ enum: ['verified', 'unverified'] })
  @IsOptional()
  status: string;
}
