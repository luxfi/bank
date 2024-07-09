import { Migration } from '@mikro-orm/migrations';

export class Migration20220429075433 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `client_name` varchar(50) null, add `known` varchar(50) null, add `years_known` varchar(50) null, add `met_face` varchar(50) null, add `number_of_beneficial_owners` varchar(50) null, add `applicant_for_business` varchar(50) null, add `classify_as_pep` varchar(50) null, add `automatically_high` varchar(50) null, add `sanctioned_corporate` varchar(50) null, add `high_risk_corporate` varchar(50) null, add `highest_risk` varchar(50) null, add `public_or_wholly` varchar(50) null, add `bearer` varchar(50) null, add `ownership_info` varchar(50) null, add `client_entity_apply` varchar(50) null, add `consider_where` varchar(50) null, add `principal_area_sanction` varchar(50) null, add `principal_area_risk` varchar(50) null, add `principal_area_apply` varchar(50) null, add `business_purpose` varchar(50) null, add `business_purpose_options` varchar(50) null, add `high_risk_activity` varchar(50) null, add `activity_regulated` varchar(50) null, add `value_of_entity` varchar(50) null;',
    );
  }
}
