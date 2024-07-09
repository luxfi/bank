import { Module } from '@nestjs/common';
import {
  MikroOrmRegisteredForUserClients,
  MikroOrmRegisteredForUser,
} from '@tools/models';
import { BeneficiariesModule } from '../beneficiaries/beneficiaries.module';
import { MailerModule } from '../mailer/mailer.module';
import { OpenPaydModule } from '../openpayd/open-payd.module';
import { ClientsAdminController } from './clients-admin.controller';
import { UsersAdminController } from './users-admin.controller';
import { UsersAdminService } from './users-admin.service';
import { UsersModule } from '../users/users.module';
import { ClientsService } from '../clients/clients.service';
import { ClientsModule } from '../clients/clients.module';
import { MikroOrmRegisteredForClients } from '@tools/models/clients';
import { AuthModule } from '../auth/auth.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MikroOrmRegisteredForClients(),
    MikroOrmRegisteredForUserClients(),
    MikroOrmRegisteredForUser(),
    UsersModule,
    OpenPaydModule,
    BeneficiariesModule,
    MailerModule,
    ClientsModule,
    AuthModule,
    TransactionsModule,
  ],
  providers: [UsersAdminService, ClientsService],
  exports: [UsersAdminService],
  controllers: [UsersAdminController, ClientsAdminController],
})
export class AdminModule {}
