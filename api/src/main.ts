import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

function buildSwagger(app) {
  // Set up Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('CDAX API')
    .setDescription('')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(Sentry.Handlers.requestHandler());
  expressApp.use(Sentry.Handlers.tracingHandler());

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({
        app: expressApp,
      }),
      new Tracing.Integrations.Postgres(),
    ],
  });

  const rawBodyBuffer = (req: Request, res: Response, buf: Buffer) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString('utf8');
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true, limit: '50mb' }));
  app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '50mb' }));

  // Handle OPTIONS requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.sendStatus(204);
    } else {
      next();
    }
  });

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Enable cookie support
  app.use(cookieParser());

  // Increase payload limit
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(helmet());

  // Set global prefix
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  buildSwagger(app);

  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError: (error) => true,
    }),
  );

  // Add a simple root endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({ status: 'ok' });
  });

  const port = process.env.PORT || 3000;
  if (process.env.NODE_ENV === 'production') {
    await app.listen(port, '0.0.0.0');
  } else {
    await app.listen(port);
  }
}
bootstrap();
