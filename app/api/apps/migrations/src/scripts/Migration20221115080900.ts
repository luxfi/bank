import { Migration } from '@mikro-orm/migrations';

export class Migration20221115080900 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `individual_metadata` modify `date_of_birth` datetime default current_timestamp;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `individual_metadata` modify `date_of_birth` datetime;');
  }

}
