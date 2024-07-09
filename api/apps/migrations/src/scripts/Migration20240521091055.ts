import { Migration } from '@mikro-orm/migrations';

export class Migration20240521091055 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE IF NOT EXISTS \`client_metadata_temp\` (
        \`uuid\` varchar(36) not null,
        \`session\` varchar(255) not null,
        \`detail\` json not null,
        \`client_id\` varchar(36) not null,
        \`created_at\` datetime not null,
        \`updated_at\` datetime not null,
        \`deleted_at\` datetime not null,
        PRIMARY KEY (\`uuid\`)
      ) default character set utf8mb4 engine = InnoDB;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE `client_metadata_temp`');
  }
}
