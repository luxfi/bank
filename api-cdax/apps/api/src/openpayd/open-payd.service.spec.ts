import { Test, TestingModule } from '@nestjs/testing';
import { OpenPaydService } from './open-payd.service';
import { RoutingCodeType } from './model/routing-code-type.enum';

describe('OpenPaydService', () => {
    let service: OpenPaydService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({providers: [OpenPaydService]}).compile();
        service = module.get<OpenPaydService>(OpenPaydService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateBeneficiary', () => {
        it('should terminate successfully for valid beneficiaries', async () => {
            await expect(
                service.validateBeneficiaryToCreate({
                    name: 'Test beneficiary',
                    bankAccountHolderName: 'Test Holder Name',
                    bankCountry: 'GB',
                    currency: 'GBP',
                    accountNumber: '12345678',
                    routingCodeType1: RoutingCodeType.SortCode,
                    routingCodeValue1: '123456'
                })
            ).resolves.not.toThrow();
        });
    });
});
