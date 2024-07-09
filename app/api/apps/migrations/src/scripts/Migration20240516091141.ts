import { Migration } from '@mikro-orm/migrations';

export class Migration20240516091141 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `residence_nationality_residence_of_beneficial` varchar(255) null;',
    );
  }
}
