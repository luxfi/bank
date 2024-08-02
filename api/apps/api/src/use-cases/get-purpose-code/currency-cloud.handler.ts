import { PaymentProviderCurrencyCloud } from '@cdaxfx/ports-currency-cloud';
import { User } from '@cdaxfx/tools-models';
import { GetPurposeCodesUseCase } from './abstract.handler';
import { PurposeCodeRequest } from './types/purpose-code.request.type';
import { PurposeCodeResponse } from './types/purpose-code.response.type';

export class GetPurposeCodesCCUseCase extends GetPurposeCodesUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request
    ) {
        super();
    }

    async handle(query: PurposeCodeRequest, user: User): Promise<PurposeCodeResponse> {
        const { bankCountryCode, currency } = query;

        const params = {
            bank_account_country: bankCountryCode,
            currency
        };

        const result = await this.paymentProvider.getPurposeCodes(params, user);

        return {
            purposeCodes: result.purpose_codes?.map((purposeCode) => ({
                code: purposeCode.purpose_code,
                description: purposeCode.purpose_description
            }))
        };
    }
}
