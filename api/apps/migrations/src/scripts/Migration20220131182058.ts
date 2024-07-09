import { Migration } from '@mikro-orm/migrations';

export class Migration20220131182058 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `user` add `role` varchar(255) not null default 'user:admin';",
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `role`;');
  }
}
