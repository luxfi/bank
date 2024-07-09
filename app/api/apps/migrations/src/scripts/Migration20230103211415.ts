import { Migration } from '@mikro-orm/migrations';

export class Migration20230103211415 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `estimated_arrival` varchar(255) null, add `transferred_at` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `estimated_arrival`;');
    this.addSql('alter table `transaction` drop `transferred_at`;');
  }

}
