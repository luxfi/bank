import { Migration } from '@mikro-orm/migrations';

export class Migration20221201142003 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` add `state` varchar(255) null, add `postcode` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` drop `state`;');
    this.addSql('alter table `beneficiary` drop `postcode`;');
  }

}
