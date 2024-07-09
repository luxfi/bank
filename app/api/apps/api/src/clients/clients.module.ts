import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmRegisteredForClients } from '@tools/models/clients';
import { AuthService } from '../auth/auth.service';
import { ClientController } from './clients.controller';
import { ClientsService } from './clients.service';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { MikroOrmRegisteredForUserClients } from '@tools/models';

@Module({
  imports: [
    MikroOrmRegisteredForClients(),
    MikroOrmRegisteredForUserClients(),
    forwardRef(() => AuthModule),
  ],
  controllers: [ClientController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
