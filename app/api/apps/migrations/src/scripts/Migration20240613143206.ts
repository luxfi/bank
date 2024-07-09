import { Migration } from '@mikro-orm/migrations';

export class Migration20240613143206 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `source_of_founds_are_funds_assets_coming_from_a3d2_details` varchar(255) null;',
    );
  }
}
