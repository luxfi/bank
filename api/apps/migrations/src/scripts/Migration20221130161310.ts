import { Migration } from '@mikro-orm/migrations';

export class Migration20221130161310 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `individual_metadata` add `state` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `individual_metadata` drop `state`;');
  }

}
