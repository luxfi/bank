import { EBalanceOperation, ECurrencyCode } from '@cdaxfx/tools-misc';

export class ViewBalancesRequestDto {
    forOperation: EBalanceOperation;
    currency: ECurrencyCode;
}
