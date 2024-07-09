import { Migration } from '@mikro-orm/migrations';

export class Migration20220902091230 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists `cloud_currency`;');

  }
  async down(): Promise<void> {
    this.addSql('drop table if exists `cloud_currency`;');

  }
}
