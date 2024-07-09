import { Migration } from '@mikro-orm/migrations';

export class Migration20220303095148 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `contact` modify `is_approved` tinyint(1) default false;',
    );

    this.addSql('alter table `user` modify `role` varchar(255) not null;');
  }
  
}
