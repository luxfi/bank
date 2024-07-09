import { Migration } from '@mikro-orm/migrations';

export class Migration20220119004329 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `user` add `verification_code` varchar(255) null, add `verified_at` datetime null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `user` drop `verification_code`, drop `verified_at`;',
    );
  }
}
