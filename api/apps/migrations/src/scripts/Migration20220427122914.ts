import { Migration } from '@mikro-orm/migrations';

export class Migration20220427122914 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `business_metadata` add `registered_office1` varchar(255) null, add `registered_office2` varchar(255) null, add `registered_office3` varchar(255) null, add `principal_place` varchar(255) null, add `mailing_address` varchar(255) null, add `address1` varchar(255) null, add `address2` varchar(255) null, add `previous_office1` varchar(255) null, add `previous_office2` varchar(255) null, add `previous_office3` varchar(255) null, add `other_contact_info` varchar(255) null, add `expected_activity` varchar(255) null, add `expected_volume` varchar(255) null;',
    );
  }
}
