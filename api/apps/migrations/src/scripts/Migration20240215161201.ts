import { Migration } from '@mikro-orm/migrations';

export class Migration20240215161201 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user` add `profile_image` varchar(600) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `profile_image`;');
  }
}
