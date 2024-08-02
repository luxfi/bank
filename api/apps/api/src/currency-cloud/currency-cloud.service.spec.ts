// import { Test, TestingModule } from '@nestjs/testing';
// import { CurrencyCloudService } from './currency-cloud.service';
// import { RoutingCodeType } from './model/routing-code-type.enum';

// describe('CurrencyCloudService', () => {
//     let service: CurrencyCloudService;

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [CurrencyCloudService]
//         }).compile();

//         service = module.get<CurrencyCloudService>(CurrencyCloudService);
//     });

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     describe('validateBeneficiary', () => {
//         it('should terminate successfully for valid beneficiaries', async () => {
//             await expect(
//                 service.validateBeneficiaryToCreate({
//                     name: 'Test beneficiary',
//                     bankAccountHolderName: 'Test Holder Name',
//                     bankCountry: 'GB',
//                     currency: 'GBP',
//                     accountNumber: '12345678',
//                     routingCodeType1: RoutingCodeType.SortCode,
//                     routingCodeValue1: '123456'
//                 }, null, null)
//             ).resolves.not.toThrow();
//         });
//     });
// });
