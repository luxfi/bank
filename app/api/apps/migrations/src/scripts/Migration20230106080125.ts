import { Migration } from '@mikro-orm/migrations';

export class Migration20230106080125 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `gateway_completed_at` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `gateway_completed_at`;');
  }

}
