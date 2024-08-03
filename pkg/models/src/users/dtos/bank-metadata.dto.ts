import { ApiProperty } from '@nestjs/swagger';
import { isInUk } from '@cdaxfx/tools-misc';
import { IsISO31661Alpha2, Matches, MaxLength, ValidateIf } from 'class-validator';
import { Currencies } from '../../beneficiaries';

export class BankMetadataDto {
  @ApiProperty()
  @MaxLength(255)
  bankName: string;

  @ApiProperty()
  @MaxLength(255)
  branch: string;

  @ApiProperty()
  @IsISO31661Alpha2()
  bankCountry: string;

  @ApiProperty()
  @MaxLength(255)
  accountHolderName: string;

  @ApiProperty()
  @ValidateIf((obj) => isInUk(obj.bankCountry) && !obj.IBAN)
  @Matches(/^[0-9]{6}$/)
  sortCode: string;

  @ApiProperty()
  @ValidateIf((obj) => isInUk(obj.bankCountry) && !obj.IBAN)
  @Matches(/^[0-9]{8}$/)
  accountNumber: string;

  @ApiProperty()
  @ValidateIf((obj) => obj.IBAN && (!obj.sortCode || !obj.accountNumber))
  @Matches(/^([A-Z0-9]\s*){15,34}$/)
  IBAN: string;

  @ApiProperty()
  @ValidateIf((obj) => obj.bicSwift && (!obj.sortCode || !obj.accountNumber))
  @Matches(/^[0-9A-Z]{8}$|^[0-9A-Z]{11}$/)
  bicSwift: string;

  @ApiProperty()
  currency: Currencies;
}
