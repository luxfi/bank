import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForFees } from '@luxbank/tools-models';
import { FeesService } from './fees.service';

@Module({
    imports: [MikroOrmRegisteredForFees()],
    providers: [FeesService],
    exports: [FeesService],
})
export class FeesModule { }
