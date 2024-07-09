import { Migration } from '@mikro-orm/migrations';

export class Migration20220315092230 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `user` add `has_accepted_terms` tinyint(1) not null;',
    );
    this.addSql(
      "alter table `user` modify `role` varchar(255) default 'user:admin';",
    );
  }
}
