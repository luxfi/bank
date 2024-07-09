import { Migration } from '@mikro-orm/migrations';

export class Migration20240314161600 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `transaction` add `approver_uuid` varchar(36) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `approver_uuid`;');
  }
}
