import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CronjobService } from './password-rotate-job.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const yourService = app.get(CronjobService);
  await yourService.checkPasswordUpdates();
  await app.close();
}
bootstrap();
