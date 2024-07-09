import { Migration } from '@mikro-orm/migrations';

export class Migration20231110145203 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE IF NOT EXISTS \`request_access\` (
        \`uuid\` varchar(36) not null,
        \`email\` varchar(255) not null,
        \`firstname\` varchar(255) not null,
        \`lastname\` varchar(255) not null,
        \`mobile_number\` varchar(255) not null,
        \`created_at\` datetime not null,
        \`updated_at\` datetime not null,
        PRIMARY KEY (\`uuid\`)
      ) default character set utf8mb4 engine = InnoDB;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE `request_access`');
  }
}
