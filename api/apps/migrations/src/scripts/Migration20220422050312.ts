import { Migration } from '@mikro-orm/migrations';

export class Migration20220422050312 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `user_broker` add `comments` varchar(5000);');
  }
}
