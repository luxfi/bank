import { Test, TestingModule } from '@nestjs/testing';
import { SwiftCodeService } from './swift-code.service';

describe('SwiftCodeService', () => {
    let service: SwiftCodeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({providers: [SwiftCodeService]}).compile();
        service = module.get<SwiftCodeService>(SwiftCodeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
