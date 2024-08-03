import { ECurrencyCode } from '@luxbank/tools-misc';

export interface ViewDetailRequest {
    currency?: ECurrencyCode;
    account?: string;
    paymentType?: string;

    page?: number;
    limit?: number;
}
