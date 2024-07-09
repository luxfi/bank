import { Migration } from '@mikro-orm/migrations';

export class Migration20220318101001 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `user` modify `has_accepted_terms` tinyint(1) not null default false;',
    );
  }
}
