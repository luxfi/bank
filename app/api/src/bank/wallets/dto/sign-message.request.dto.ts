import { IsString, IsOptional } from 'class-validator';

export class SignMessageRequestDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  chain?: string;
}
