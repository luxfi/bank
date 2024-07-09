import { Migration } from '@mikro-orm/migrations';

export class Migration20240516091045 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `complete_where_applicable_name_of_director` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `business_purpose_if_yes_who_it_regulated_by` varchar(255) null;',
    );
  }
}
