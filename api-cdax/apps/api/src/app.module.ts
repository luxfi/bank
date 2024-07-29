import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { memoryStorage } from 'multer';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { ClientsModule } from './clients/clients.module';
import { CurrencyCloudModule } from './currency-cloud/currency-cloud.module';
import { DocumentsManagerModule } from './documents-manager/documents-manager.module';
import MikroOrmConfig from '../mikro-orm.config';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { MailContactModule } from './mail-contact/mail-contact.module';
import { BankModule } from './bank/bank.module';
import { UsersV2Module } from './bank/users/users.module';
import { RequestLoggingMiddleware } from '@cdaxfx/tools-misc';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { ScheduleModule } from '@nestjs/schedule';

const apiModules = [
    AuthModule,
    UsersModule,
    UsersV2Module,
    ClientsModule,
    BeneficiariesModule,
    DocumentsManagerModule,
    CurrencyCloudModule,
    AdminModule,
    WebhooksModule,
    MailContactModule,
    BankModule
];

@Module({
    imports: [
        ScheduleModule.forRoot(),
        MorganModule,
        MikroOrmModule.forRoot(MikroOrmConfig),
        ...apiModules,
        MulterModule.register({
            storage: memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024, // Set a 10MB file size limit
            },
        }),
        ThrottlerModule.forRoot([{
            ttl: 60,
            limit: 60
        }]),
        RavenModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useValue: new RavenInterceptor()
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: MorganInterceptor('dev')
        }
    ]
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggingMiddleware).forRoutes('*');
    }
}
