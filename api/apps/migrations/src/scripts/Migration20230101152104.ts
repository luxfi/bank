import { Migration } from '@mikro-orm/migrations';

export class Migration20230101152104 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `source` varchar(255) null, add `destination` varchar(255) null;');
    this.addSql('alter table `transaction` change `buy_balance_id` `destination_balance_id` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` add `buy_balance_id` varchar(255) null;');
    this.addSql('alter table `transaction` drop `destination_balance_id`;');
    this.addSql('alter table `transaction` drop `source`;');
    this.addSql('alter table `transaction` drop `destination`;');
  }

}
