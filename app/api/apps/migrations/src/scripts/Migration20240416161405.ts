import { Migration } from '@mikro-orm/migrations';

export class Migration20240416161405 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `account` add `credentials` varchar(1000) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `account` drop `credentials`;');
  }
}
