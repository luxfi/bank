import { Migration } from '@mikro-orm/migrations';

export class Migration20240513091042 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE IF NOT EXISTS \`client_document\` (
        \`uuid\` varchar(36) not null,
        \`type\` varchar(255) not null,
        \`document_uuid\` varchar(36) not null,
        \`client_uuid\` varchar(36) not null,
        \`is_approved\` tinyint(1) not null,
        \`created_at\` datetime not null,
        \`updated_at\` datetime not null,
        \`deleted_at\` datetime not null,
        PRIMARY KEY (\`uuid\`)
      ) default character set utf8mb4 engine = InnoDB;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE `client_document`');
  }
}
