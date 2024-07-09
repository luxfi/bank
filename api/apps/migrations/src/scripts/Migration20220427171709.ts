import { Migration } from '@mikro-orm/migrations';

export class Migration20220427171709 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `user_broker` change `user_uuid` `account_uuid` varchar(36);',
    );
    this.addSql(
      'alter table `user_broker` add index `account_broker_account_uuid_index`(`account_uuid`);',
    );
    this.addSql('alter table `user_broker` rename `account_brokers`;');
  }
}
