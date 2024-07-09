import { Migration } from '@mikro-orm/migrations';

export class Migration20221208165608 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `individual_metadata` add `previous_state` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `individual_metadata` drop `previous_state`;');
  }

}
