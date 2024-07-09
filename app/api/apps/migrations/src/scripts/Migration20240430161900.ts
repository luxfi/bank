import { Migration } from '@mikro-orm/migrations';

export class Migration20240430161900 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` add `impersonator_uuid` varchar(36) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` drop `impersonator_uuid`;');
  }
}
