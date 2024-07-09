import { Migration } from '@mikro-orm/migrations';

export class Migration20221208103828 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `buy_balance_id` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `buy_balance_id`;');
  }

}
