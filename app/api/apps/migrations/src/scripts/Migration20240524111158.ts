import { Migration } from '@mikro-orm/migrations';

export class Migration20240524111158 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` add `address_line2` varchar(255) null;',
    );
  }
}
