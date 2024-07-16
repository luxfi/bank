import {
  Connection,
  IDatabaseDriver,
  LoadStrategy,
  MikroORMOptions,
} from '@mikro-orm/core';
import {
  BENEFICIARIES_REGISTERED_ENTITIES,
  BankMetadata,
  Broker,
  BusinessMetadata,
  DOCUMENTS_MANAGER_REGISTERED_ENTITIES,
  Director,
  FEES_REGISTERED_ENTITIES,
  IndividualMetadata,
  RiskAssessment,
  Shareholder,
  USER_REGISTERED_ENTITIES,
  TRANSACTION_REGISTERED_ENTITIES,
  USER_CLIENTS_REGISTERED_ENTITIES,
  CLIENTS_METADATA_TEMP_ENTITIES,
} from '@tools/models';
import { CLIENTS_REGISTERED_ENTITIES } from '@tools/models/clients';
import * as fs from 'fs';
import { MobileVerificationEntity } from './auth/model/mobile-verification.entity';
import { Session } from './sessions/model/session.entity';
import { MAIL_CONTACT_REGISTERED_ENTITIES } from '@tools/models/mail-contact';

const config: Partial<MikroORMOptions<IDatabaseDriver<Connection>>> = {
  type: 'mysql',
  logger: console.log.bind(console),
  debug: process.env.NODE_ENV === 'development',
  forceUtcTimezone: true,
  migrations: {
    snapshot: true,
  },
  entities: [
    ...USER_REGISTERED_ENTITIES,
    ...BENEFICIARIES_REGISTERED_ENTITIES,
    ...DOCUMENTS_MANAGER_REGISTERED_ENTITIES,
    ...FEES_REGISTERED_ENTITIES,
    ...TRANSACTION_REGISTERED_ENTITIES,
    ...CLIENTS_REGISTERED_ENTITIES,
    ...USER_CLIENTS_REGISTERED_ENTITIES,
    ...MAIL_CONTACT_REGISTERED_ENTITIES,
    ...CLIENTS_METADATA_TEMP_ENTITIES,
    BankMetadata,
    IndividualMetadata,
    BusinessMetadata,
    Broker,
    RiskAssessment,
    Director,
    Shareholder,
    // TODO: migrate
    MobileVerificationEntity,
    Session,
  ],
  clientUrl: process.env.DATABASE_URL,
  driverOptions: {
    connection: {
      // ssl: {
      //   ca: fs.readFileSync('./rds-us-east-1-bundle.pem'),
      // },
    },
  },
  allowGlobalContext: true,
};

export default config;
