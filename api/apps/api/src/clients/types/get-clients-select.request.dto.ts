import { IsOptional, MinLength } from 'class-validator';

export class GetClientSelectRequestDto {
  @IsOptional()
  @MinLength(3)
  name?: string;
}
