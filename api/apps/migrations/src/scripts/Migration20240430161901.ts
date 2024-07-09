import { Migration } from '@mikro-orm/migrations';

export class Migration20240430161901 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `cdax_id` varchar(10) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `cdax_id`;');
  }
}
