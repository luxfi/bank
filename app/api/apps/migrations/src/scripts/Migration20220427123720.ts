import { Migration } from '@mikro-orm/migrations';

export class Migration20220427123720 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `business_metadata` add `legal_entity` varchar(255) null, add `email` varchar(255) null, add `other_trading_names` varchar(255) null, add `country_of_registration` varchar(255) null, add `date_of_registration` varchar(255) null, add `telephone_number` varchar(255) null, add `date_of_incorporation` varchar(255) null, add `statutory_provision` varchar(255) null;',
    );
  }
}
