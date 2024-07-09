import { Migration } from '@mikro-orm/migrations';

export class Migration20220331152531 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `account` add `archived_at` datetime null;');

    this.addSql('alter table `user` add `archived_at` datetime null;');
  }
}
