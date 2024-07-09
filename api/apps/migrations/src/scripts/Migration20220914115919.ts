import { Migration } from '@mikro-orm/migrations';

export class Migration20220914115919 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user` add `invited_by` varchar(255) null;');
  }
}
