import { Migration } from '@mikro-orm/migrations';

export class Migration20220421090635 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `individual_metadata` add `employer_name` varchar(255) null, add `employer_address1` varchar(255) null, add `employer_address2` varchar(255) null, add `employer_address3` varchar(255) null, add `public_position` varchar(255) null, add `high_profile_position` varchar(255) null;');
  }

}
