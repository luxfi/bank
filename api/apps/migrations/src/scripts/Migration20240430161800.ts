import { Migration } from '@mikro-orm/migrations';

export class Migration20240430161800 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `transaction` add `impersonator_uuid` varchar(36) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `impersonator_uuid`;');
  }
}
