import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCryptoPaymentRequestDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  metadata?: Record<string, string>;
}

export class CaptureCryptoPaymentRequestDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}

export class RefundCryptoPaymentRequestDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}
