import { Migration } from '@mikro-orm/migrations';

export class Migration20240108162104 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await knex.transaction(async (trx) => {
      await trx.raw(`
        INSERT INTO \`client\` (account_uuid, uuid, email, firstname, lastname, created_at, updated_at, deleted_at)
        SELECT
        distinct(acc.uuid),
        UUID(), 
        "", 
        "",
        "", 
        NOW(), 
        NOW(), 
        NULL
      FROM \`account\` acc;`);

      await trx.raw(`
        INSERT INTO \`user_client\` (user_uuid, client_uuid)
          SELECT
            u.uuid AS "user_uuid",
            c.uuid AS "client_uuid"
          FROM \`user\` u
          JOIN \`contact\` ct ON u.contact_uuid = ct.uuid
          JOIN \`account\` a ON ct.account_uuid = a.uuid
          JOIN \`client\` c ON a.uuid = c.account_uuid;
      `);

      await trx.raw(`UPDATE \`contact\` SET account_uuid = NULL ;`);

      await trx.raw('ALTER TABLE `client` DROP COLUMN `firstname`;');
      await trx.raw('ALTER TABLE `client` DROP COLUMN `lastname`;');
      await trx.raw('ALTER TABLE `client` DROP COLUMN `email`;');
    });
  }

  async down(): Promise<void> {
    const knex = this.getKnex();
    await knex.transaction(async (trx) => {
      await trx.raw(`
        DELETE FROM \`user_client\`
        WHERE client_uuid IN (SELECT client_uuid FROM \`client\` WHERE username IN (SELECT username FROM \`user\`));
      `);

      await trx.raw(`
        DELETE FROM \`client\`
        WHERE username IN (SELECT username FROM \`user\`);
      `);
    });
  }
}
