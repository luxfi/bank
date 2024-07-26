import { BeneficiariesRepository, User, GetBeneficiariesRequest, GetBeneficiariesPaginatedResponse } from '@cdaxfx/tools-models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetBeneficiariesDomainUseCase {
    constructor(
        private readonly beneficiariesRepository: BeneficiariesRepository,
    ) { }

    async handle(query: GetBeneficiariesRequest, user: User): Promise<GetBeneficiariesPaginatedResponse> {
        return this.beneficiariesRepository.findActiveByUserPaginated(query, user);
    }
}