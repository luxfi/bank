import { Migration } from '@mikro-orm/migrations';

export class Migration20240528111158 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `user_clients_metadata` add `phone_number` varchar(255) null;',
    );
  }
}
