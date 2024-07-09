import { PaymentProviderIFX } from '@ports/ifx';
import { User } from '@tools/models';
import { GetWalletDetailUseCase } from './abstract.handler';
import {
  ViewDetailResponse,
  ViewPaginatedDetailResponse,
} from './types/detail.response.type';
import { ViewDetailRequest } from './types/detail.request.type';
import { ERoutingCodesNames } from '../types/transaction.interface';

export class GetWalletDetailIFXUseCase extends GetWalletDetailUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderIFX,
    private request: Request,
    private beneficiariesService: any,
  ) {
    super();
  }

  async handle(query: ViewDetailRequest): Promise<ViewPaginatedDetailResponse> {
    const wallets = await this.paymentProvider.getWallets({
      limit: query.limit,
      offset: ((query.page || 1) - 1) * (query.limit || 10),
    });

    return {
      data: wallets.data.map((data) => {
        return {
          accountHolderName: data.accountName,
          bankName: 'IFX PAYMENTS',
          bankAddress: '33 Cavendish Square, London, W1G 0PW',
          bankCountryName: 'United Kingdom',
          bankCountryCode: 'GB',
          routingCodes: [
            {
              name: ERoutingCodesNames.IBAN,
              value: data.iban,
            },
            {
              name: ERoutingCodesNames.BIC_SWIFT,
              value: data.swiftBic,
            },
            {
              name: ERoutingCodesNames.ACCOUNT_NUMBER,
              value: data.accountNumber,
            },
            {
              name: ERoutingCodesNames.SORT_CODE,
              value: data.sortCode,
            },
          ],
        };
      }) as ViewDetailResponse[],
      pagination: {
        totalEntries: wallets.meta.total,
        totalPages: Math.ceil(wallets.meta.total / wallets.meta.limit),
        page: Math.ceil(wallets.meta.offset / wallets.meta.limit) + 1,
        limit: wallets.meta.limit,
      },
    };
  }
}
