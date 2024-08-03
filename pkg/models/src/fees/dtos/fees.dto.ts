import { ApiProperty } from '@nestjs/swagger';
import { Currencies } from '../../beneficiaries';

export class FeesDto {
  @ApiProperty({ nullable: true })
  conversion_amount: string;

  @ApiProperty({ nullable: true })
  conversion_currency: Currencies;

  @ApiProperty({ nullable: true })
  SEPA_amount: string;

  @ApiProperty({ nullable: true })
  SEPA_currency: Currencies;

  @ApiProperty({ nullable: true })
  SEPA_INSTANT_amount: string;

  @ApiProperty({ nullable: true })
  SEPA_INSTANT_currency: Currencies;

  @ApiProperty({ nullable: true })
  TARGET2_amount: string;

  @ApiProperty({ nullable: true })
  TARGET2_currency: Currencies;

  @ApiProperty({ nullable: true })
  SWIFT_amount: string;

  @ApiProperty({ nullable: true })
  SWIFT_currency: Currencies;

  @ApiProperty({ nullable: true })
  CHAPS_amount: string;

  @ApiProperty({ nullable: true })
  CHAPS_currency: Currencies;

  @ApiProperty({ nullable: true })
  FASTER_PAYMENTS_amount: string;

  @ApiProperty({ nullable: true })
  FASTER_PAYMENTS_currency: Currencies;
}
