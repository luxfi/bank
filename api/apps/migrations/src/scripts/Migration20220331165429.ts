import { Migration } from '@mikro-orm/migrations';

export class Migration20220331165429 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `contact` add `currency_cloud_password_url` varchar(255) null;',
    );
  }
}
