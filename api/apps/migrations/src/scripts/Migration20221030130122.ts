import { Migration } from '@mikro-orm/migrations';

export class Migration20221030130122 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `shareholder` modify `uuid` varchar(36) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `shareholder` modify `uuid` varchar(255) not null;');
  }

}
