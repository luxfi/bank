import { ECurrencyCode } from '@cdaxfx/tools-misc';

export interface ViewBalancesResponse {
    currency: ECurrencyCode;
    name: string;
    amount: number;
}
