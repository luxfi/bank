import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  page = 1;

  @IsOptional()
  limit = 100;
}
