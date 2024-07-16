import { Migration } from '@mikro-orm/migrations';

export class Migration20240714053935 extends Migration {

  async up(): Promise<void> {
    this.addSql('ALTER TABLE `user_client` RENAME TO `user_clients`;');
    this.addSql('ALTER TABLE `user_clients` ADD `uuid` varchar(255) null, ADD `metadata` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `user_clients`;');
  }

}
