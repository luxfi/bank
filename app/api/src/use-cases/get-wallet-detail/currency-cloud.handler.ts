import { PaymentProviderCurrencyCloud } from '@cdaxfx/ports-currency-cloud';
import { COUNTRY_NAME, ECountryCode, ECurrencyCode } from '@cdaxfx/tools-misc';
import { User } from '@cdaxfx/tools-models';
import { Request } from 'express';
import { GetWalletDetailUseCase } from './abstract.handler';
import { ViewDetailRequest } from './types/detail.request.type';
import { ViewDetailResponse, ViewPaginatedDetailResponse } from './types/detail.response.type';
import { ERoutingCodesNames } from '@cdaxfx/ports-ifx';

export class GetWalletDetailCCUseCase extends GetWalletDetailUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request
    ) {
        super();
    }

    async handle(query: ViewDetailRequest, user: User): Promise<ViewPaginatedDetailResponse> {
        const { page, limit, account, currency, paymentType } = query;

        const pageConfig = {
            page: page || 1,
            per_page: limit || 15,
            order: 'created_at',
            order_asc_desc: 'desc'
        };

        const params = {
            ...(currency && { currency: currency as ECurrencyCode }),
            ...(account && { account_id: account }),
            ...(paymentType && { payment_type: paymentType }),
            ...pageConfig
        };

        const result = await this.paymentProvider.getWalletDetail(params, user);

        return {
            data: result.funding_accounts?.map<ViewDetailResponse>(
                (fundingAccount) => ({
                    accountHolderName: fundingAccount.account_holder_name,
                    bankName: fundingAccount.bank_name,
                    bankAddress: fundingAccount.bank_address,
                    bankCountryCode: fundingAccount.bank_country as ECountryCode,
                    bankCountryName: COUNTRY_NAME[fundingAccount.bank_country],
                    routingCodes: [
                        {
                            value: fundingAccount.routing_code,
                            name: fundingAccount.routing_code_type as ERoutingCodesNames
                        },
                        {
                            value: fundingAccount.account_number,
                            name: fundingAccount.account_number_type as ERoutingCodesNames
                        }
                    ]
                })
            ),
            pagination: {
                totalEntries: result.pagination.total_entries,
                totalPages: result.pagination.total_pages,
                page: result.pagination.current_page,
                limit: result.pagination.per_page
            }
        };
    }
}
