import { Test, TestingModule } from '@nestjs/testing';
import { ConversionsController } from './conversions.controller';
import { ConversionsService } from './conversions.service';

describe('ConversionsController', () => {
  let controller: ConversionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversionsController],
      providers: [ConversionsService],
    }).compile();

    controller = module.get<ConversionsController>(ConversionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
