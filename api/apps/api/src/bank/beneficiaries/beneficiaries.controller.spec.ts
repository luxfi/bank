import { Test, TestingModule } from '@nestjs/testing';
import { BeneficiariesController } from './beneficiaries.controller';
import { BeneficiariesService } from './beneficiaries.service';

describe('BeneficiariesController', () => {
  let controller: BeneficiariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeneficiariesController],
      providers: [BeneficiariesService],
    }).compile();

    controller = module.get<BeneficiariesController>(BeneficiariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
