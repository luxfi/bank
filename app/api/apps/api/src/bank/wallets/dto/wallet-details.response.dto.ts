import { ECountryCode } from '@tools/misc';
import { PaginationDefault } from '@tools/misc/types/pagination.type';

export enum ERoutingCodesNames {
  SORT_CODE = 'sort code',
  BSB_CODE = 'bsb code',
  INSTITUTION_NO = 'institution no',
  BANK_CODE = 'bank code',
  BRANCH_CODE = 'branch code',
  ABA = 'aba',
  CLABE = 'clabe',
  CNAPS = 'cnaps',
  IFSC = 'ifsc',
  IBAN = 'iban',
  BIC_SWIFT = 'bic swift',
  ACCOUNT_NUMBER = 'account number',
}

export class RoutingCodes {
  name: ERoutingCodesNames;
  value: string;
}

export class WalletDetailResponseDto {
  accountHolderName: string;
  bankName: string;
  bankAddress: string;
  bankCountryCode: ECountryCode;
  bankCountryName: string;
  routingCodes: RoutingCodes[];
}

export class WalletsPaginatedDetailResponseDto {
  data: WalletDetailResponseDto[];
  pagination?: PaginationDefault;
}
