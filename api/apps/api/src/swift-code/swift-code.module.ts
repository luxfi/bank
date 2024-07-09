import { Module, forwardRef } from '@nestjs/common';
import { CurrencyCloudModule } from '../currency-cloud/currency-cloud.module';
import { SwiftCodeService } from './swift-code.service';

@Module({
  imports: [forwardRef(() => CurrencyCloudModule)],
  providers: [SwiftCodeService],
  exports: [SwiftCodeService],
})
export class SwiftCodeModule {}
