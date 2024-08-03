import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmRegisteredForClients, MikroOrmRegisteredForUserClients } from '@luxbank/tools-models';
import { ClientController } from './clients.controller';
import { ClientsService } from './clients.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MikroOrmRegisteredForClients(),
        MikroOrmRegisteredForUserClients(),
        forwardRef(() => AuthModule)
    ],
    controllers: [ClientController],
    providers: [ClientsService],
    exports: [ClientsService]
})
export class ClientsModule { }
