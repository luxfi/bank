import { Migration } from '@mikro-orm/migrations';

export class Migration20231218232101 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `transaction` add `status_approval` varchar(100);',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `status_approval`;');
  }
}
