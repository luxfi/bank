import { Connection, IDatabaseDriver, MikroORMOptions } from '@mikro-orm/core';
import {
  BankMetadata,
  FEES_REGISTERED_ENTITIES,
  USER_REGISTERED_ENTITIES,
} from '@tools/models';
import * as fs from 'fs';

const config: Partial<MikroORMOptions<IDatabaseDriver<Connection>>> = {
  type: 'mysql',
  forceUtcTimezone: true,
  allowGlobalContext: true,
  migrations: {
    snapshot: true,
  },
  entities: [
    ...USER_REGISTERED_ENTITIES,
    ...FEES_REGISTERED_ENTITIES,
    BankMetadata,
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
