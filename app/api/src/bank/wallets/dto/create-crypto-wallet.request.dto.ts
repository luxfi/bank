import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateCryptoWalletRequestDto {
  @IsString()
  chain: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(5)
  threshold?: number;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(7)
  parties?: number;
}
