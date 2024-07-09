import { Migration } from '@mikro-orm/migrations';

export class Migration20230106163801 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `gateway_spread_table` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `gateway_spread_table`;');
  }

}
