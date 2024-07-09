// cronjob.module.ts
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForUser } from '@tools/models';
import { MailerModule } from './mailer/mailer.module';
import MikroOrmConfig from './mikro-orm.config';
import { CronjobService } from './password-rotate-job.service';

@Module({
  imports: [
    MikroOrmModule.forRoot(MikroOrmConfig),
    MikroOrmRegisteredForUser(),
    MailerModule,
  ],
  providers: [CronjobService],
})
export class AppModule {}
