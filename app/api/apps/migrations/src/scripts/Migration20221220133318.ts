import { Migration } from '@mikro-orm/migrations';

export class Migration20221220133318 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `business_metadata` add `registered_office1_address2` varchar(255) null, add `registered_office1_postcode` varchar(255) null, add `registered_office1_city` varchar(255) null, add `registered_office1_state` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `business_metadata` drop `registered_office1_address2`;');
    this.addSql('alter table `business_metadata` drop `registered_office1_postcode`;');
    this.addSql('alter table `business_metadata` drop `registered_office1_city`;');
    this.addSql('alter table `business_metadata` drop `registered_office1_state`;');
  }

}
