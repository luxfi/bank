import { Migration } from '@mikro-orm/migrations';

export class Migration20220422075842 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `notes` varchar(2000) null;',
    );
  }
}
