import { Migration } from '@mikro-orm/migrations';

export class Migration20221208111728 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `gateway_fee_amount` varchar(255) null, add `gateway_fee_currency` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `gateway_fee_amount`;');
    this.addSql('alter table `transaction` drop `gateway_fee_currency`;');
  }

}
