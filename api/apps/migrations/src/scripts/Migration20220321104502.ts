import { Migration } from '@mikro-orm/migrations';

export class Migration20220321104502 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `contact` drop index `contact_mobile_number_unique`;',
    );
  }
}
