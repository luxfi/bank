import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmRegisteredForBeneficiaries, MikroOrmRegisteredForClientsMetadataTemp, MikroOrmRegisteredForDocumentsManager, MikroOrmRegisteredForUser, MikroOrmRegisteredForUserClients, MikroOrmRegisteredForClients, UserDocumentsRepository } from '@luxbank/tools-models';
import { AuthModule } from '../auth/auth.module';
import { BeneficiariesModule } from '../beneficiaries/beneficiaries.module';
import { ClientsService } from '../clients/clients.service';
import { DocumentsManagerModule } from '../documents-manager/documents-manager.module';
import { MailerModule } from '../mailer/mailer.module';
import { OpenPaydModule } from '../openpayd/open-payd.module';
import { SwiftCodeModule } from '../swift-code/swift-code.module';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { RegistrationService } from './registration/registration.service';
import { UsersController } from './users.controller';
import { UsersV2Controller } from './users-v2.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MikroOrmRegisteredForUser(),
        MikroOrmRegisteredForClients(),
        MikroOrmRegisteredForUserClients(),
        MikroOrmRegisteredForBeneficiaries(),
        forwardRef(() => AuthModule),
        MailerModule,
        MikroOrmRegisteredForDocumentsManager(),
        forwardRef(() => BeneficiariesModule),
        DocumentsManagerModule,
        forwardRef(() => OpenPaydModule),
        SwiftCodeModule,
        MikroOrmRegisteredForClientsMetadataTemp()
    ],
    providers: [
        UsersService,
        RegistrationService,
        InvitationsService,
        ClientsService,
        UserDocumentsRepository //chris
    ],
    exports: [UsersService, RegistrationService, InvitationsService, UserDocumentsRepository], //chris
    controllers: [UsersController, UsersV2Controller, InvitationsController]
})
export class UsersModule { }
