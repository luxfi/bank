import { Migration } from '@mikro-orm/migrations';

export class Migration20220501130626 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `broker` add `comment` varchar(5000) null;');
  }
}
