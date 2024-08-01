import { ECurrencyCode } from '@cdaxfx/tools-misc';

export class ViewDetailsRequestDto {
    currency?: ECurrencyCode;

    account?: string;

    paymentType?: string;

    page?: number;

    limit?: number;
}
