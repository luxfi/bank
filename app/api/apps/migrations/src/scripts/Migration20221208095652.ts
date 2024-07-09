import { Migration } from '@mikro-orm/migrations';

export class Migration20221208095652 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `buy_amount` varchar(255) null, add `buy_currency` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `buy_amount`;');
    this.addSql('alter table `transaction` drop `buy_currency`;');
  }

}
