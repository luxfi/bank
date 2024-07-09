import { Migration } from '@mikro-orm/migrations';

export class Migration20230101154108 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `sender_name` varchar(255) null, add `sender_address` varchar(255) null, add `sender_information` varchar(255) null, add `sender_account_number` varchar(255) null, add `sender_bic` varchar(255) null, add `sender_iban` varchar(255) null, add `sender_routing_key` varchar(255) null, add `sender_routing_value` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `sender_name`;');
    this.addSql('alter table `transaction` drop `sender_address`;');
    this.addSql('alter table `transaction` drop `sender_information`;');
    this.addSql('alter table `transaction` drop `sender_account_number`;');
    this.addSql('alter table `transaction` drop `sender_bic`;');
    this.addSql('alter table `transaction` drop `sender_iban`;');
    this.addSql('alter table `transaction` drop `sender_routing_key`;');
    this.addSql('alter table `transaction` drop `sender_routing_value`;');
  }

}
