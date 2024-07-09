import { Test, TestingModule } from '@nestjs/testing';
import { MiscController } from './misc.controller';
import { MiscService } from './misc.service';

describe('MiscController', () => {
  let controller: MiscController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MiscController],
      providers: [MiscService],
    }).compile();

    controller = module.get<MiscController>(MiscController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
