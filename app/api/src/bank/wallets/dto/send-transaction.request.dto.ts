import { IsString, IsOptional } from 'class-validator';

export class SendTransactionRequestDto {
  @IsString()
  to: string;

  @IsString()
  amount: string;

  @IsString()
  chain: string;

  @IsOptional()
  @IsString()
  tokenAddress?: string;

  @IsOptional()
  @IsString()
  data?: string;
}
