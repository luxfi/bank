import { Migration } from '@mikro-orm/migrations';

export class Migration20221215165603 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `session` add `type` varchar(255) null, add `username` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `session` drop `type`;');
    this.addSql('alter table `session` drop `username`;');
  }

}
