import { ECurrencyCode } from '@luxbank/tools-misc';

export interface ViewBalancesResponse {
    currency: ECurrencyCode;
    name: string;
    amount: number;
}
