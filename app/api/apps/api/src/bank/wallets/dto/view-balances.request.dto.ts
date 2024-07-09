import { EBalanceOperation, ECurrencyCode } from '@tools/misc';

export class ViewBalancesRequestDto {
  forOperation: EBalanceOperation;
  currency: ECurrencyCode;
}
