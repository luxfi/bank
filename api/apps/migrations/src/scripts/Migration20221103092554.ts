import { Migration } from '@mikro-orm/migrations';

export class Migration20221103092554 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` add `is_approved` tinyint(1) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` drop `is_approved`;');
  }

}
