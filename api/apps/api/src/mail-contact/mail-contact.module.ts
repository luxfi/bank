import { Module } from '@nestjs/common';
import { MailerModule } from '../mailer/mailer.module';
import { MailContactController } from './mail-contact.controller';
import { MailContactService } from './mail-contact.service';
import { RecaptchaGuard } from './recaptcha.guard';
import { MikroOrmRegisteredForMailContact } from '@cdaxfx/tools-models';

@Module({
    imports: [MikroOrmRegisteredForMailContact(), MailerModule],
    providers: [MailContactService, RecaptchaGuard],
    exports: [],
    controllers: [MailContactController]
})
export class MailContactModule { }
