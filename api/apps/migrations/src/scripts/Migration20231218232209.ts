import { Migration } from '@mikro-orm/migrations';

export class Migration20231218232209 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `description` varchar(500);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `description`;');
  }
}
