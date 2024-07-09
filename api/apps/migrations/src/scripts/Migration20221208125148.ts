import { Migration } from '@mikro-orm/migrations';

export class Migration20221208125148 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `payment_reason` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `payment_reason`;');
  }

}
