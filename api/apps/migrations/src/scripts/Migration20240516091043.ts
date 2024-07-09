import { Migration } from '@mikro-orm/migrations';

export class Migration20240516091043 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `risk_assessment` add `risk_rating_assessment_completed` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `source_of_funds_are_funds_assets_coming_from_a3d2` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `complete_any_notes_regarding_risk_assessment` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `complete_assessment_complete_by_name` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `complete_detail` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `complete_notes_rationale_to_justify` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `jurisdiction_is_company_ownership_directors` varchar(255) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add `risk_rating_assessment_notes_re_rationale_to_justify` varchar(255) null;',
    );

    this.addSql(
      'alter table `risk_assessment` add `ra_attach_document_uuid` varchar(36) null;',
    );
  }
}
