import { defineConfig } from '@mikro-orm/postgresql';
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
    CLIENTS_REGISTERED_ENTITIES,
    MAIL_CONTACT_REGISTERED_ENTITIES
} from '@cdaxfx/tools-models';
import { MobileVerificationEntity } from './src/auth/model/mobile-verification.entity';
import { Session } from './src/sessions/model/session.entity';

export default defineConfig({
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
        Session
    ],
    clientUrl: process.env.DATABASE_URL,
    driverOptions: {
        connection: {
            // ssl: {
            //   ca: fs.readFileSync('./rds-us-east-1-bundle.pem'),
            // },
        }
    },
    allowGlobalContext: true
});