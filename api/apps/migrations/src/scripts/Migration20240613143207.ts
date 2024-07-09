import { Migration } from '@mikro-orm/migrations';

export class Migration20240613143207 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` change `source_of_founds_are_funds_assets_coming_from_a3d2_details` `source_of_founds_are_funds_assets_coming_from_a3d2details` varchar(255) null;',
    );
  }
}
