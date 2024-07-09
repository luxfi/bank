import { Migration } from '@mikro-orm/migrations';

export class Migration20230112134149 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `individual_metadata` modify `title` varchar(255) null, modify `firstname` varchar(255) null, modify `lastname` varchar(255) null, modify `place_of_birth` varchar(255) null, modify `address_line1` varchar(255) null, modify `city` varchar(255) null, modify `postcode` varchar(255) null, modify `state` varchar(255) null, modify `country` varchar(255) null, modify `nationality` varchar(255) null, modify `gender` varchar(255) null default \'other\', modify `identification_type` varchar(255) null default \'none\', modify `occupation` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `individual_metadata` modify `title` varchar(255) not null, modify `firstname` varchar(255) not null, modify `lastname` varchar(255) not null, modify `place_of_birth` varchar(255) not null, modify `address_line1` varchar(255) not null, modify `city` varchar(255) not null, modify `postcode` varchar(255) not null, modify `state` varchar(255) not null, modify `country` varchar(255) not null, modify `nationality` varchar(255) not null, modify `gender` varchar(255) not null default \'other\', modify `identification_type` varchar(255) not null default \'none\', modify `occupation` varchar(255) not null;');
  }

}
