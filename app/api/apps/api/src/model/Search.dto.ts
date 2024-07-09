import { IsOptional } from 'class-validator';
import { PaginationDto } from './Pagination.dto';

export class SearchUsersDto extends PaginationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  entityType?: string;

  @IsOptional()
  country?: string;
}
