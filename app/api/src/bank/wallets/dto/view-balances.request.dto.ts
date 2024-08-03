import { EBalanceOperation, ECurrencyCode } from '@luxbank/tools-misc';

export class ViewBalancesRequestDto {
    forOperation: EBalanceOperation;
    currency: ECurrencyCode;
}
