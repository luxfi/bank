import { Migration } from '@mikro-orm/migrations';

export class Migration20240516091047 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `next_risk_assessment` datetime null;',
    );
  }
}
