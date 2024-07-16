import { Migration } from '@mikro-orm/migrations';

export class Migration20220927135918 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists `cloud_currency`;');

    this.addSql(
      'alter table `broker` drop foreign key `broker_account_uuid_foreign`;',
    );

    this.addSql(
      "alter table `individual_metadata` modify `gender` varchar(255) not null default 'other', modify `identification_type` varchar(255) not null default 'none';",
    );

    this.addSql(
      "alter table `account` modify `entity_type` varchar(255) not null default 'individual';",
    );

    this.addSql('alter table `director` modify `uuid` int unsigned not null;');

    this.addSql(
      'alter table `broker` modify `name` varchar(255), modify `payment` varchar(255), modify `bank_account` varchar(255), modify `contract` varchar(255), modify `comment` varchar(255);',
    );
    this.addSql(
      'alter table `broker` add constraint `broker_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );

    this.addSql(
      'alter table `risk_assessment` modify `sanction` varchar(255), modify `rating` varchar(255), modify `apply` varchar(255), modify `aml` varchar(255), modify `sanctioned_jurisdiction` varchar(255), modify `high_risk_jurisdiction` varchar(255), modify `third_party` varchar(255), modify `understood` varchar(255), modify `material_connection` varchar(255), modify `sensitive_activity` varchar(255), modify `volume` varchar(255), modify `transactions` varchar(255), modify `knowledge` varchar(255), modify `pep` varchar(255), modify `adverse_information` varchar(255), modify `risk_rating` varchar(255), modify `completed_by` varchar(255), modify `director` varchar(255), modify `notes` varchar(255), modify `client_name` varchar(255), modify `known` varchar(255), modify `years_known` varchar(255), modify `met_face` varchar(255), modify `number_of_beneficial_owners` varchar(255), modify `applicant_for_business` varchar(255), modify `classify_as_pep` varchar(255), modify `automatically_high` varchar(255), modify `sanctioned_corporate` varchar(255), modify `high_risk_corporate` varchar(255), modify `highest_risk` varchar(255), modify `public_or_wholly` varchar(255), modify `bearer` varchar(255), modify `ownership_info` varchar(255), modify `client_entity_apply` varchar(255), modify `consider_where` varchar(255), modify `principal_area_sanction` varchar(255), modify `principal_area_risk` varchar(255), modify `principal_area_apply` varchar(255), modify `business_purpose` varchar(255), modify `business_purpose_options` varchar(255), modify `high_risk_activity` varchar(255), modify `activity_regulated` varchar(255), modify `value_of_entity` varchar(255);',
    );

    this.addSql(
      'alter table `shareholder` modify `uuid` int unsigned not null;',
    );
    this.addSql(
      'alter table `shareholder` rename index `shareholder_account_uuid_foreign` to `shareholder_account_uuid_index`;',
    );

    this.addSql('alter table `user` drop index `user_contact_uuid_index`;');

    this.addSql('alter table `contact` add `open_payd_id` varchar(255) null;');
    this.addSql(
      'alter table `contact` modify `is_approved` tinyint(1) not null default false;',
    );
    this.addSql(
      'alter table `contact` drop index `contact_bank_metadata_uuid_index`;',
    );
    this.addSql(
      'alter table `contact` drop index `contact_individual_metadata_uuid_index`;',
    );
    this.addSql(
      'alter table `contact` drop index `contact_invitation_uuid_index`;',
    );
    // this.addSql(
    //   'alter table `contact` add constraint `contact_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    // );

    this.addSql(
      'alter table `user_document` drop index `user_document_document_uuid_index`;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `broker` drop foreign key `broker_account_uuid_foreign`;',
    );

    this.addSql(
      'alter table `contact` drop foreign key `contact_account_uuid_foreign`;',
    );

    this.addSql(
      "alter table `account` modify `entity_type` varchar(255) null default 'individual';",
    );
    this.addSql(
      'alter table `account` add index `account_bank_metadata_uuid_index`(`bank_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add index `account_individual_metadata_uuid_index`(`individual_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add index `account_business_metadata_uuid_index`(`business_metadata_uuid`);',
    );

    this.addSql(
      'alter table `broker` modify `name` varchar(50), modify `payment` varchar(10), modify `bank_account` varchar(50), modify `contract` varchar(100), modify `comment` varchar(5000);',
    );
    this.addSql(
      'alter table `broker` add constraint `broker_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table `contact` modify `is_approved` tinyint(1) not null;',
    );
    this.addSql('alter table `contact` drop `open_payd_id`;');
    this.addSql(
      'alter table `contact` add constraint `contact_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete no action;',
    );
    this.addSql(
      'alter table `contact` add index `contact_bank_metadata_uuid_index`(`bank_metadata_uuid`);',
    );
    this.addSql(
      'alter table `contact` add index `contact_individual_metadata_uuid_index`(`individual_metadata_uuid`);',
    );
    this.addSql(
      'alter table `contact` add index `contact_invitation_uuid_index`(`invitation_uuid`);',
    );

    this.addSql('alter table `director` modify `uuid` int not null;');

    this.addSql(
      "alter table `individual_metadata` modify `gender` varchar(255) null default 'other', modify `identification_type` varchar(255) null default 'none';",
    );

    this.addSql(
      'alter table `risk_assessment` modify `sanction` varchar(3), modify `rating` varchar(6), modify `apply` varchar(3), modify `aml` varchar(3), modify `sanctioned_jurisdiction` varchar(3), modify `high_risk_jurisdiction` varchar(3), modify `third_party` varchar(3), modify `understood` varchar(3), modify `material_connection` varchar(3), modify `sensitive_activity` varchar(3), modify `volume` varchar(3), modify `transactions` varchar(3), modify `knowledge` varchar(3), modify `pep` varchar(3), modify `adverse_information` varchar(3), modify `risk_rating` varchar(8), modify `completed_by` varchar(36), modify `director` varchar(36), modify `notes` varchar(2000), modify `client_name` varchar(50), modify `known` varchar(50), modify `years_known` varchar(50), modify `met_face` varchar(50), modify `number_of_beneficial_owners` varchar(50), modify `applicant_for_business` varchar(50), modify `classify_as_pep` varchar(50), modify `automatically_high` varchar(50), modify `sanctioned_corporate` varchar(50), modify `high_risk_corporate` varchar(50), modify `highest_risk` varchar(50), modify `public_or_wholly` varchar(50), modify `bearer` varchar(50), modify `ownership_info` varchar(50), modify `client_entity_apply` varchar(50), modify `consider_where` varchar(50), modify `principal_area_sanction` varchar(50), modify `principal_area_risk` varchar(50), modify `principal_area_apply` varchar(50), modify `business_purpose` varchar(50), modify `business_purpose_options` varchar(50), modify `high_risk_activity` varchar(50), modify `activity_regulated` varchar(50), modify `value_of_entity` varchar(50);',
    );

    this.addSql('alter table `shareholder` modify `uuid` int not null;');
    this.addSql(
      'alter table `shareholder` rename index `shareholder_account_uuid_index` to `shareholder_account_uuid_foreign`;',
    );

    this.addSql(
      'alter table `user` add index `user_contact_uuid_index`(`contact_uuid`);',
    );

    this.addSql(
      'alter table `user_document` add index `user_document_document_uuid_index`(`document_uuid`);',
    );
  }
}
