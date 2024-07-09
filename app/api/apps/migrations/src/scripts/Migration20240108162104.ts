import { Migration } from '@mikro-orm/migrations';

export class Migration20240108162104 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `transaction` add `client_uuid` varchar(36) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `client_uuid`;');
  }
}
