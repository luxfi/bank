import { Migration } from '@mikro-orm/migrations';

export class Migration20240129145203 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE IF NOT EXISTS \`news_letter\` (
        \`uuid\` varchar(36) not null,
        \`email\` varchar(255) not null,
        \`first_name\` varchar(255) not null,
        \`last_name\` varchar(255) not null,
        \`created_at\` datetime not null,
        \`updated_at\` datetime not null,
        PRIMARY KEY (\`uuid\`)
      ) default character set utf8mb4 engine = InnoDB;`,
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE `news_letter`');
  }
}
