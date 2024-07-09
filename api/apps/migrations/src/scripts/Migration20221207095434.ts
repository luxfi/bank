import { Migration } from '@mikro-orm/migrations';

export class Migration20221207095434 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` add `bank_name` varchar(255) null, add `branch_name` varchar(255) null, add `bank_address` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` drop `bank_name`;');
    this.addSql('alter table `beneficiary` drop `branch_name`;');
    this.addSql('alter table `beneficiary` drop `bank_address`;');
  }

}
