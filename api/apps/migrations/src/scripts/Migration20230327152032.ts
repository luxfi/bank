import { Migration } from '@mikro-orm/migrations';

export class Migration20230327152032 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `is_mobile2faenabled` tinyint(1) null default true;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `is_mobile2faenabled`;');
  }

}
