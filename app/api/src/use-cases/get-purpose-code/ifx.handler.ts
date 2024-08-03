import { PaymentProviderIFX } from '@luxbank/ports-ifx';
import { User } from '@luxbank/tools-models';
import { GetPurposeCodesUseCase } from './abstract.handler';
import { PurposeCodeRequest } from './types/purpose-code.request.type';
import { PurposeCodeResponse } from './types/purpose-code.response.type';

export class GetPurposeCodesIFXUseCase extends GetPurposeCodesUseCase {
    constructor(
        protected paymentProvider: PaymentProviderIFX,
        private request: Request
    ) {
        super();
    }

    async handle(query: PurposeCodeRequest, user: User): Promise<PurposeCodeResponse> {
        return {
            purposeCodes: [
                {
                    code: 'P1',
                    description: 'Purpose 1'
                },
                {
                    code: 'P2',
                    description: 'Purpose 2'
                }
            ]
        };
    }
}
