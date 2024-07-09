import { Migration } from '@mikro-orm/migrations';

export class Migration20240318161602 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` add `client_uuid` varchar(36) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` drop `client_uuid`;');
  }
}
