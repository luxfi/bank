import { Migration } from '@mikro-orm/migrations';

export class Migration20221208124009 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `beneficiary_id` varchar(255) null, add `payment_date` varchar(255) null, add `payment_type` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `beneficiary_id`;');
    this.addSql('alter table `transaction` drop `payment_date`;');
    this.addSql('alter table `transaction` drop `payment_type`;');
  }

}
