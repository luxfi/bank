import { Migration } from '@mikro-orm/migrations';
import { SUPER_CLIENT } from '@tools/misc';

export class Migration20240129145203 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await knex.transaction(async (trx) => {
      await trx.raw(`
        INSERT INTO \`client\` (account_uuid, uuid, created_at, updated_at, deleted_at)
        VALUES (null, "${SUPER_CLIENT.UUID}", NOW(), NOW(), NULL);
      `);

      await trx.raw(`
        INSERT INTO \`user_clients\` (uuid, user_uuid, client_uuid)
        SELECT UUID(), u.uuid, "${SUPER_CLIENT.UUID}"
        FROM \`user\` u
        WHERE u.role = '${SUPER_CLIENT.ROLE}';
      `);

      await trx.raw(`
        INSERT INTO \`user_clients_metadata\` (uuid, user_client_uuid, role, who_they_are)
        SELECT UUID(), uc.uuid, u.role, NULL
        FROM \`user\` u
        JOIN \`user_clients\` uc ON uc.user_uuid = u.uuid
        WHERE u.role = '${SUPER_CLIENT.ROLE}';
      `);

      await trx.raw(`
        ALTER TABLE user
        DROP COLUMN role;
      `);

      await trx.commit();
    });
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE `news_letter`');
  }
}
