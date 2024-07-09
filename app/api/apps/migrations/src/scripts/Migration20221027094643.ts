import { Migration } from '@mikro-orm/migrations';

export class Migration20221027094643 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `bank_metadata` add `bic_swift` varchar(255) null, add `currency` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `bank_metadata` drop `bic_swift`;');
    this.addSql('alter table `bank_metadata` drop `currency`;');
  }

}
