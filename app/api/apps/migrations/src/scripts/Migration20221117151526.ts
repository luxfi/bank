import { Migration } from '@mikro-orm/migrations';

export class Migration20221117151526 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user_document` add `status` varchar(10) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user_document` drop `status`;');
  }
}
