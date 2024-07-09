import { Migration } from '@mikro-orm/migrations';

export class Migration20221208095844 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `fixed_side` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `fixed_side`;');
  }

}
