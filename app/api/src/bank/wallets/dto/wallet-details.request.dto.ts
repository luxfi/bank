import { ECurrencyCode } from '@luxbank/tools-misc';

export class ViewDetailsRequestDto {
    currency?: ECurrencyCode;

    account?: string;

    paymentType?: string;

    page?: number;

    limit?: number;
}
