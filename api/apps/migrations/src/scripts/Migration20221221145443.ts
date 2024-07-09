import { Migration } from '@mikro-orm/migrations';

export class Migration20221221145443 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `fee` add `account_id` varchar(255) null;');
    this.addSql('alter table `fee` change `conversion_fee` `conversion_currency` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `fee` add `conversion_fee` varchar(255) null;');
    this.addSql('alter table `fee` drop `conversion_currency`;');
    this.addSql('alter table `fee` drop `account_id`;');
  }

}
