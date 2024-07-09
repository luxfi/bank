import { Migration } from '@mikro-orm/migrations';

export class Migration20240516091055 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` change `source_of_funds_are_funds_assets_coming_from_a3d2` `source_of_founds_are_funds_assets_coming_from_a3d2` varchar(255);',
    );
  }
}
