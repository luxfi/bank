import { Connection, IDatabaseDriver, MikroORMOptions } from '@mikro-orm/core';

import { TSMigrationGenerator } from '@mikro-orm/migrations';
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
} from '@tools/models';
import * as fs from 'fs';

import * as dotenv from 'dotenv';
import { USER_CLIENTS_REGISTERED_ENTITIES } from '@tools/models/user-clients/registered-entities';

dotenv.config({ path: './apps/migrations/.env' });

const config: Partial<MikroORMOptions<IDatabaseDriver<Connection>>> = {
  type: 'mysql',
  forceUtcTimezone: true,
  migrations: {
    snapshot: false,
    glob: '!(*.d).{js,ts}',
    path: 'dist/scripts',
    pathTs: 'src/scripts',
    emit: 'ts',
    generator: TSMigrationGenerator,
  },

  entities: [
    ...USER_REGISTERED_ENTITIES,
    ...BENEFICIARIES_REGISTERED_ENTITIES,
    ...DOCUMENTS_MANAGER_REGISTERED_ENTITIES,
    ...FEES_REGISTERED_ENTITIES,
    ...USER_CLIENTS_REGISTERED_ENTITIES,
    BankMetadata,
    IndividualMetadata,
    BusinessMetadata,
    Broker,
    RiskAssessment,
    Director,
    Shareholder,
  ],
  clientUrl: process.env.DATABASE_URL,
  driverOptions: {
    connection: {
      ssl: {
        ca: fs.readFileSync('./rds-us-east-1-bundle.pem'),
      },
    },
  },
};

export default config;
