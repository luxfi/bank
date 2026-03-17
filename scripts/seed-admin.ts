/**
 * Seed Admin User for Lux Financial
 *
 * Creates a SuperAdmin user (z@lux.network) with a corresponding Account entity.
 * Password is hashed with bcrypt (cost factor 14) matching @luxbank/misc.
 *
 * Usage:
 *   DATABASE_URL="postgresql://user:pass@host:5432/lux_bank" \
 *     npx --package=pg --package=bcryptjs --package=ts-node ts-node scripts/seed-admin.ts
 *
 * Or from the api workspace (where deps are available):
 *   cd app/api && source .env && npx ts-node ../../scripts/seed-admin.ts
 */

import { randomUUID } from "crypto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require("pg");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "z@lux.network";
const ADMIN_FIRSTNAME = "Zach";
const ADMIN_LASTNAME = "Kelling";
const ADMIN_ROLE = "admin:super"; // UserRole.SuperAdmin
const SANDBOX_PASSWORD = "LuxBank!2026";
const BCRYPT_ROUNDS = 14; // matches @luxbank/misc generateHash

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    // Check if user already exists
    const existing = await client.query(
      "SELECT uuid FROM users WHERE username = $1",
      [ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log(`Admin user ${ADMIN_EMAIL} already exists (uuid: ${existing.rows[0].uuid}). Skipping.`);
      return;
    }

    const passwordHash = await bcrypt.hash(SANDBOX_PASSWORD, BCRYPT_ROUNDS);
    const now = new Date();

    // Create User
    const userUuid = randomUUID();
    await client.query(
      `INSERT INTO users (uuid, username, password, firstname, lastname, has_accepted_terms, verified_at, password_updated_at, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userUuid,
        ADMIN_EMAIL,
        passwordHash,
        ADMIN_FIRSTNAME,
        ADMIN_LASTNAME,
        true,        // has_accepted_terms
        now,         // verified_at (email verified)
        now,         // password_updated_at
        now,         // created_at
        now,         // updated_at
      ]
    );
    console.log(`Created user: ${ADMIN_EMAIL} (uuid: ${userUuid})`);

    // Create Account (Sequelize table: 'account')
    const accountUuid = randomUUID();
    await client.query(
      `INSERT INTO account (uuid, entity_type, is_approved, users_uuid, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        accountUuid,
        "individual",    // AccountType.Individual
        true,            // isApproved
        userUuid,
        now,
        now,
      ]
    );
    console.log(`Created account: ${accountUuid}`);

    // Create Client
    const clientUuid = randomUUID();
    await client.query(
      `INSERT INTO client (uuid, account_uuid, created_at, updated_at)
       VALUES ($1, $2, $3, $4)`,
      [clientUuid, accountUuid, now, now]
    );
    console.log(`Created client: ${clientUuid}`);

    // Create Contact (MikroORM entity, links user to account)
    const contactUuid = randomUUID();
    await client.query(
      `INSERT INTO contact (uuid, country, is_approved, is_sub_account, account_uuid, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        contactUuid,
        "US",
        true,
        false,
        accountUuid,
        now,
        now,
      ]
    );
    console.log(`Created contact: ${contactUuid}`);

    // Link contact to user
    await client.query(
      "UPDATE users SET contact_uuid = $1 WHERE uuid = $2",
      [contactUuid, userUuid]
    );
    console.log("Linked contact to user.");

    // Create UserClient pivot record
    const userClientUuid = randomUUID();
    await client.query(
      `INSERT INTO user_clients (uuid, user_uuid, client_uuid)
       VALUES ($1, $2, $3)`,
      [userClientUuid, userUuid, clientUuid]
    );
    console.log(`Created user_client: ${userClientUuid}`);

    // Create UserClientMetadata with SuperAdmin role
    const metadataUuid = randomUUID();
    await client.query(
      `INSERT INTO user_clients_metadata (uuid, user_client_uuid, role)
       VALUES ($1, $2, $3)`,
      [metadataUuid, userClientUuid, ADMIN_ROLE]
    );
    console.log(`Created user_clients_metadata with role: ${ADMIN_ROLE}`);

    console.log("\nSeed complete.");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${SANDBOX_PASSWORD}`);
    console.log(`  Role:     SuperAdmin (${ADMIN_ROLE})`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
