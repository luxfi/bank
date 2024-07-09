import { Migration } from '@mikro-orm/migrations';

export class Migration20230327152032 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user` add `password_updated_at` datetime;');
    this.addSql(
      'UPDATE `user` SET `password_updated_at` = `created_at` WHERE `password_updated_at` IS NULL;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `password_updated_at`;');
  }
}
