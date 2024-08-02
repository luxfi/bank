import { Migration } from '@mikro-orm/migrations';

export class Migration20240726174845 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bank_metadata" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "bank_name" varchar(255) not null, "branch" varchar(255) not null, "bank_country" varchar(255) not null, "account_holder_name" varchar(255) not null, "sort_code" varchar(255) not null, "account_number" varchar(255) not null, "iban" varchar(255) null, "bic_swift" varchar(255) null, "currency" varchar(255) null, constraint "bank_metadata_pkey" primary key ("uuid"));');

    this.addSql('create table "business_metadata" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "company_name" varchar(255) null, "trading_name" varchar(255) null, "website_url" varchar(255) null, "other_contact_info" varchar(255) null, "nature_of_business" varchar(255) null, "company_registration_number" varchar(255) null, "is_vat_registered" boolean null, "vat_number" varchar(255) null, "is_publicly_trading" boolean null, "stock_market_location" varchar(255) null, "stock_market" varchar(255) null, "is_regulated" boolean null, "regulator_name" varchar(255) null, "legal_entity" varchar(255) null, "email" varchar(255) null, "other_trading_names" varchar(255) null, "company_type" text check ("company_type" in (\'LIMITED_LIABILITY\', \'SOLE_TRADER\', \'PARTNERSHIP\', \'CHARITY\', \'JOINT_STOCK_COMPANY\', \'PUBLIC_LIMITED_COMPANY\')) not null, "country_of_registration" varchar(255) null, "date_of_registration" varchar(255) null, "telephone_number" varchar(255) null, "date_of_incorporation" varchar(255) null, "statutory_provision" varchar(255) null, "registered_office1" varchar(255) null, "registered_office1_address2" varchar(255) null, "registered_office1_postcode" varchar(255) null, "registered_office1_city" varchar(255) null, "registered_office1_state" varchar(255) null, "registered_office2" varchar(255) null, "registered_office3" varchar(255) null, "principal_place" varchar(255) null, "mailing_address" varchar(255) null, "address1" varchar(255) null, "address2" varchar(255) null, "previous_office1" varchar(255) null, "previous_office2" varchar(255) null, "previous_office3" varchar(255) null, "expected_activity" varchar(255) null, "expected_volume" varchar(255) null, constraint "business_metadata_pkey" primary key ("uuid"));');

    this.addSql('create table "individual_metadata" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "title" varchar(255) null, "firstname" varchar(255) null, "lastname" varchar(255) null, "former_name" varchar(255) null, "other_name" varchar(255) null, "date_of_birth" timestamptz null default current_timestamp, "place_of_birth" varchar(255) null, "address_line1" varchar(255) null, "address_line2" varchar(255) null, "city" varchar(255) null, "postcode" varchar(255) null, "state" varchar(255) null, "country" varchar(255) null, "previous_address_line1" varchar(255) null, "previous_address_line2" varchar(255) null, "previous_city" varchar(255) null, "previous_postcode" varchar(255) null, "previous_country" varchar(255) null, "previous_state" varchar(255) null, "nationality" varchar(255) null, "gender" varchar(255) null default \'other\', "identification_number" varchar(255) null, "identification_type" varchar(255) null default \'\', "occupation" varchar(255) null, "employer_name" varchar(255) null, "employer_address1" varchar(255) null, "employer_address2" varchar(255) null, "employer_address3" varchar(255) null, "public_position" varchar(255) null, "high_profile_position" varchar(255) null, constraint "individual_metadata_pkey" primary key ("uuid"));');

    this.addSql('create table "request_access" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "email" varchar(255) not null, "firstname" varchar(255) not null, "lastname" varchar(255) not null, "mobile_number" varchar(255) not null, constraint "request_access_pkey" primary key ("uuid"));');

    this.addSql('create table "user" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "username" varchar(255) not null, "password" varchar(255) null, "ip" varchar(255) null, "firstname" varchar(255) not null, "lastname" varchar(255) not null, "profile_image" varchar(255) null, "has_accepted_terms" boolean not null default false, "archived_at" varchar(255) null, "invited_by" varchar(255) null, "verification_code" varchar(255) null, "verified_at" timestamptz null, "contact_uuid" varchar(36) null, "two_fasecret" varchar(255) null, "two_fa" boolean null, "is_mobile2faenabled" boolean null default true, "password_updated_at" timestamptz null default current_timestamp, "current_client_uuid" varchar(36) null, constraint "user_pkey" primary key ("uuid"));');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_contact_uuid_unique" unique ("contact_uuid");');

    this.addSql('create table "document" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "original_filename" varchar(255) not null, "own_cloud_path" varchar(255) not null, "creator_uuid" varchar(36) null, constraint "document_pkey" primary key ("uuid"));');

    this.addSql('create table "account" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "entity_type" varchar(255) not null default \'individual\', "bank_metadata_uuid" varchar(36) null, "individual_metadata_uuid" varchar(36) null, "business_metadata_uuid" varchar(36) null, "cloud_currency_id" varchar(255) null, "open_payd_id" varchar(255) null, "gateway_id" varchar(255) null, "gateway" varchar(255) null, "archived_at" timestamptz null, "fee_uuid" varchar(36) null, "is_approved" boolean null default false, "users_uuid" varchar(36) null, "credentials" varchar(255) null, constraint "account_pkey" primary key ("uuid"));');
    this.addSql('alter table "account" add constraint "account_bank_metadata_uuid_unique" unique ("bank_metadata_uuid");');
    this.addSql('alter table "account" add constraint "account_individual_metadata_uuid_unique" unique ("individual_metadata_uuid");');
    this.addSql('alter table "account" add constraint "account_business_metadata_uuid_unique" unique ("business_metadata_uuid");');
    this.addSql('alter table "account" add constraint "account_fee_uuid_unique" unique ("fee_uuid");');

    this.addSql('create table "shareholder" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "full_name" varchar(255) null, "dob" timestamptz null, "occupation" varchar(255) null, "telephone_number" varchar(255) null, "business_metadata_uuid" varchar(36) null, "individual_metadata_uuid" varchar(36) null, "email" varchar(255) null, "nationality" varchar(255) null, "address1" varchar(255) null, "address2" varchar(255) null, "previous_address1" varchar(255) null, "previous_address2" varchar(255) null, "entity_type" varchar(255) null, "country" varchar(255) null, "shares" int null, "account_uuid" varchar(36) null, "comply_launch_id" varchar(255) null, "comply_launch_response" varchar(64) null, constraint "shareholder_pkey" primary key ("uuid"));');
    this.addSql('alter table "shareholder" add constraint "shareholder_business_metadata_uuid_unique" unique ("business_metadata_uuid");');
    this.addSql('alter table "shareholder" add constraint "shareholder_individual_metadata_uuid_unique" unique ("individual_metadata_uuid");');

    this.addSql('create table "risk_assessment" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "sanction" varchar(255) null, "rating" varchar(255) null, "apply" varchar(255) null, "aml" varchar(255) null, "sanctioned_jurisdiction" varchar(255) null, "high_risk_jurisdiction" varchar(255) null, "third_party" varchar(255) null, "understood" varchar(255) null, "material_connection" varchar(255) null, "sensitive_activity" varchar(255) null, "volume" varchar(255) null, "transactions" varchar(255) null, "knowledge" varchar(255) null, "pep" varchar(255) null, "adverse_information" varchar(255) null, "risk_rating" varchar(255) null, "completed_by" varchar(255) null, "completion_date" timestamptz null, "director" varchar(255) null, "approval_date" timestamptz null, "notes" varchar(255) null, "client_name" varchar(255) null, "known" varchar(255) null, "years_known" varchar(255) null, "met_face" varchar(255) null, "number_of_beneficial_owners" varchar(255) null, "applicant_for_business" varchar(255) null, "classify_as_pep" varchar(255) null, "automatically_high" varchar(255) null, "sanctioned_corporate" varchar(255) null, "high_risk_corporate" varchar(255) null, "highest_risk" varchar(255) null, "public_or_wholly" varchar(255) null, "bearer" varchar(255) null, "ownership_info" varchar(255) null, "client_entity_apply" varchar(255) null, "consider_where" varchar(255) null, "principal_area_sanction" varchar(255) null, "principal_area_risk" varchar(255) null, "principal_area_apply" varchar(255) null, "business_purpose" varchar(255) null, "business_purpose_options" varchar(255) null, "high_risk_activity" varchar(255) null, "activity_regulated" varchar(255) null, "value_of_entity" varchar(255) null, "risk_rating_assessment_completed" varchar(255) null, "source_of_founds_are_funds_assets_coming_from_a3d2" varchar(255) null, "source_of_founds_are_funds_assets_coming_from_a3d2details" varchar(255) null, "complete_any_notes_regarding_risk_assessment" varchar(255) null, "complete_assessment_complete_by_name" varchar(255) null, "complete_detail" varchar(255) null, "complete_notes_rationale_to_justify" varchar(255) null, "jurisdiction_is_company_ownership_directors" varchar(255) null, "risk_rating_assessment_notes_re_rationale_to_justify" varchar(255) null, "ra_attach_document_uuid" varchar(36) null, "complete_where_applicable_name_of_director" varchar(255) null, "business_purpose_if_yes_who_it_regulated_by" varchar(255) null, "next_risk_assessment" timestamptz null, "residence_nationality_residence_of_beneficial" varchar(255) null, "account_uuid" varchar(36) null, constraint "risk_assessment_pkey" primary key ("uuid"));');
    this.addSql('alter table "risk_assessment" add constraint "risk_assessment_ra_attach_document_uuid_unique" unique ("ra_attach_document_uuid");');

    this.addSql('create table "pending_meta_data" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "type" varchar(255) not null, "field" varchar(255) not null, "value" varchar(255) not null, "account_uuid" varchar(36) null, constraint "pending_meta_data_pkey" primary key ("uuid"));');

    this.addSql('create table "invitation" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "email" varchar(255) not null, "firstname" varchar(255) not null, "lastname" varchar(255) not null, "secret" varchar(255) not null, "user_role" varchar(255) not null default \'user:member\', "account_uuid" varchar(36) not null, "creator_uuid" varchar(36) not null, "expired_at" timestamptz null, constraint "invitation_pkey" primary key ("uuid"));');

    this.addSql('create table "fee" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "conversion_amount" varchar(255) null, "conversion_currency" varchar(255) null, "sepa_amount" varchar(255) null, "sepa_currency" varchar(255) null, "sepa_instant_amount" varchar(255) null, "sepa_instant_currency" varchar(255) null, "target2_amount" varchar(255) null, "target2_currency" varchar(255) null, "swift_amount" varchar(255) null, "swift_currency" varchar(255) null, "chaps_amount" varchar(255) null, "chaps_currency" varchar(255) null, "faster_payments_amount" varchar(255) null, "faster_payments_currency" varchar(255) null, "account_id" varchar(255) null, "account_uuid" varchar(36) null, "updated_by_uuid" varchar(36) null, constraint "fee_pkey" primary key ("uuid"));');

    this.addSql('create table "director" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "full_name" varchar(255) null, "dob" timestamptz null, "occupation" varchar(255) null, "telephone_number" varchar(255) null, "email" varchar(255) null, "nationality" varchar(255) null, "address1" varchar(255) null, "address2" varchar(255) null, "previous_address1" varchar(255) null, "previous_address2" varchar(255) null, "country" varchar(255) null, "account_uuid" varchar(36) null, "comply_launch_id" varchar(255) null, "comply_launch_response" varchar(64) null, constraint "director_pkey" primary key ("uuid"));');

    this.addSql('create table "contact" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "cloud_currency_id" varchar(255) null, "open_payd_id" varchar(255) null, "business_role" varchar(255) null, "country" varchar(255) not null, "mobile_number" varchar(255) null, "is_approved" boolean not null default false, "expected_volume_of_transactions" varchar(255) null, "expected_value_of_turnover" varchar(255) null, "is_sub_account" boolean not null default false, "comply_launch_id" varchar(255) null, "comply_launch_response" varchar(64) null, "currency_cloud_password_url" varchar(255) null, "bank_metadata_uuid" varchar(36) null, "individual_metadata_uuid" varchar(36) null, "invitation_uuid" varchar(36) null, "account_uuid" varchar(36) null, constraint "contact_pkey" primary key ("uuid"));');
    this.addSql('alter table "contact" add constraint "contact_bank_metadata_uuid_unique" unique ("bank_metadata_uuid");');
    this.addSql('alter table "contact" add constraint "contact_individual_metadata_uuid_unique" unique ("individual_metadata_uuid");');
    this.addSql('alter table "contact" add constraint "contact_invitation_uuid_unique" unique ("invitation_uuid");');

    this.addSql('create table "client" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "account_uuid" varchar(36) null, constraint "client_pkey" primary key ("uuid"));');
    this.addSql('alter table "client" add constraint "client_account_uuid_unique" unique ("account_uuid");');

    this.addSql('create table "client_document" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "is_approved" boolean not null default false, "type" varchar(255) not null, "document_uuid" varchar(36) null, "client_uuid" varchar(36) not null, constraint "client_document_pkey" primary key ("uuid"));');
    this.addSql('alter table "client_document" add constraint "client_document_document_uuid_unique" unique ("document_uuid");');

    this.addSql('create table "broker" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "name" varchar(255) null, "address" varchar(255) null, "country" varchar(255) null, "kyc" varchar(255) null, "client" varchar(255) null, "percentage_split" int null, "payment" varchar(255) null, "bank_account" varchar(255) null, "contract" varchar(255) null, "comment" varchar(255) null, "comply_launch_id" varchar(255) null, "comply_launch_response" varchar(64) null, "account_uuid" varchar(36) null, constraint "broker_pkey" primary key ("uuid"));');

    this.addSql('create table "beneficiary" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "firstname" varchar(255) null, "lastname" varchar(255) null, "entity_type" varchar(255) null, "currency" varchar(255) null, "payment_type" varchar(255) null, "address" varchar(255) null, "address_line2" varchar(255) null, "city" varchar(255) null, "state" varchar(255) null, "postcode" varchar(255) null, "country" varchar(255) null, "company_name" varchar(255) null, "bank_name" varchar(255) null, "branch_name" varchar(255) null, "bank_address" varchar(255) null, "bank_country" varchar(255) null, "account_number" varchar(16) null, "sort_code" varchar(18) null, "iban" varchar(255) null, "bic_swift" varchar(255) null, "comply_launch_id" varchar(255) null, "comply_launch_response" varchar(64) null, "currency_cloud_id" varchar(255) null, "open_payd_id" varchar(255) null, "is_approved" boolean null default false, "gateway_id" varchar(255) null, "account_uuid" varchar(36) null, "creator_uuid" varchar(36) null, "client_uuid" varchar(255) null, "impersonator_uuid" varchar(255) null, constraint "beneficiary_pkey" primary key ("uuid"));');

    this.addSql('create table "user_clients" ("uuid" varchar(36) not null, "user_uuid" varchar(36) not null, "client_uuid" varchar(36) not null, constraint "user_clients_pkey" primary key ("uuid"));');

    this.addSql('create table "user_clients_metadata" ("uuid" varchar(36) not null, "user_client_uuid" varchar(36) not null, "role" varchar(255) not null default \'user:admin\', "phone_number" varchar(255) null, "who_they_are" varchar(255) null, constraint "user_clients_metadata_pkey" primary key ("uuid"));');
    this.addSql('alter table "user_clients_metadata" add constraint "user_clients_metadata_user_client_uuid_unique" unique ("user_client_uuid");');

    this.addSql('create table "user_document" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "is_approved" boolean not null default false, "status" varchar(255) null, "type" varchar(255) not null, "document_uuid" varchar(36) null, "user_uuid" varchar(36) not null, constraint "user_document_pkey" primary key ("uuid"));');
    this.addSql('alter table "user_document" add constraint "user_document_document_uuid_unique" unique ("document_uuid");');

    this.addSql('alter table "user" add constraint "user_contact_uuid_foreign" foreign key ("contact_uuid") references "contact" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "user" add constraint "user_current_client_uuid_foreign" foreign key ("current_client_uuid") references "client" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "document" add constraint "document_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "account" add constraint "account_bank_metadata_uuid_foreign" foreign key ("bank_metadata_uuid") references "bank_metadata" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "account" add constraint "account_individual_metadata_uuid_foreign" foreign key ("individual_metadata_uuid") references "individual_metadata" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "account" add constraint "account_business_metadata_uuid_foreign" foreign key ("business_metadata_uuid") references "business_metadata" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "account" add constraint "account_fee_uuid_foreign" foreign key ("fee_uuid") references "fee" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "account" add constraint "account_users_uuid_foreign" foreign key ("users_uuid") references "user" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "shareholder" add constraint "shareholder_business_metadata_uuid_foreign" foreign key ("business_metadata_uuid") references "business_metadata" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "shareholder" add constraint "shareholder_individual_metadata_uuid_foreign" foreign key ("individual_metadata_uuid") references "individual_metadata" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "shareholder" add constraint "shareholder_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "risk_assessment" add constraint "risk_assessment_ra_attach_document_uuid_foreign" foreign key ("ra_attach_document_uuid") references "document" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "risk_assessment" add constraint "risk_assessment_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "pending_meta_data" add constraint "pending_meta_data_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "invitation" add constraint "invitation_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade;');
    this.addSql('alter table "invitation" add constraint "invitation_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade;');

    this.addSql('alter table "fee" add constraint "fee_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "fee" add constraint "fee_updated_by_uuid_foreign" foreign key ("updated_by_uuid") references "user" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "director" add constraint "director_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "contact" add constraint "contact_bank_metadata_uuid_foreign" foreign key ("bank_metadata_uuid") references "bank_metadata" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "contact" add constraint "contact_individual_metadata_uuid_foreign" foreign key ("individual_metadata_uuid") references "individual_metadata" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "contact" add constraint "contact_invitation_uuid_foreign" foreign key ("invitation_uuid") references "invitation" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "contact" add constraint "contact_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "client" add constraint "client_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "client_document" add constraint "client_document_document_uuid_foreign" foreign key ("document_uuid") references "document" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "client_document" add constraint "client_document_client_uuid_foreign" foreign key ("client_uuid") references "client" ("uuid") on update cascade;');

    this.addSql('alter table "broker" add constraint "broker_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "beneficiary" add constraint "beneficiary_account_uuid_foreign" foreign key ("account_uuid") references "account" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "beneficiary" add constraint "beneficiary_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade on delete set null;');

    this.addSql('alter table "user_clients" add constraint "user_clients_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "user_clients" add constraint "user_clients_client_uuid_foreign" foreign key ("client_uuid") references "client" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "user_clients_metadata" add constraint "user_clients_metadata_user_client_uuid_foreign" foreign key ("user_client_uuid") references "user_clients" ("uuid") on update cascade;');

    this.addSql('alter table "user_document" add constraint "user_document_document_uuid_foreign" foreign key ("document_uuid") references "document" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "user_document" add constraint "user_document_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "account" drop constraint "account_bank_metadata_uuid_foreign";');

    this.addSql('alter table "contact" drop constraint "contact_bank_metadata_uuid_foreign";');

    this.addSql('alter table "account" drop constraint "account_business_metadata_uuid_foreign";');

    this.addSql('alter table "shareholder" drop constraint "shareholder_business_metadata_uuid_foreign";');

    this.addSql('alter table "account" drop constraint "account_individual_metadata_uuid_foreign";');

    this.addSql('alter table "shareholder" drop constraint "shareholder_individual_metadata_uuid_foreign";');

    this.addSql('alter table "contact" drop constraint "contact_individual_metadata_uuid_foreign";');

    this.addSql('alter table "document" drop constraint "document_creator_uuid_foreign";');

    this.addSql('alter table "account" drop constraint "account_users_uuid_foreign";');

    this.addSql('alter table "invitation" drop constraint "invitation_creator_uuid_foreign";');

    this.addSql('alter table "fee" drop constraint "fee_updated_by_uuid_foreign";');

    this.addSql('alter table "beneficiary" drop constraint "beneficiary_creator_uuid_foreign";');

    this.addSql('alter table "user_clients" drop constraint "user_clients_user_uuid_foreign";');

    this.addSql('alter table "user_clients" drop constraint "user_clients_user_uuid_foreign";');

    this.addSql('alter table "user_document" drop constraint "user_document_user_uuid_foreign";');

    this.addSql('alter table "risk_assessment" drop constraint "risk_assessment_ra_attach_document_uuid_foreign";');

    this.addSql('alter table "client_document" drop constraint "client_document_document_uuid_foreign";');

    this.addSql('alter table "user_document" drop constraint "user_document_document_uuid_foreign";');

    this.addSql('alter table "shareholder" drop constraint "shareholder_account_uuid_foreign";');

    this.addSql('alter table "risk_assessment" drop constraint "risk_assessment_account_uuid_foreign";');

    this.addSql('alter table "pending_meta_data" drop constraint "pending_meta_data_account_uuid_foreign";');

    this.addSql('alter table "invitation" drop constraint "invitation_account_uuid_foreign";');

    this.addSql('alter table "fee" drop constraint "fee_account_uuid_foreign";');

    this.addSql('alter table "director" drop constraint "director_account_uuid_foreign";');

    this.addSql('alter table "contact" drop constraint "contact_account_uuid_foreign";');

    this.addSql('alter table "client" drop constraint "client_account_uuid_foreign";');

    this.addSql('alter table "broker" drop constraint "broker_account_uuid_foreign";');

    this.addSql('alter table "beneficiary" drop constraint "beneficiary_account_uuid_foreign";');

    this.addSql('alter table "contact" drop constraint "contact_invitation_uuid_foreign";');

    this.addSql('alter table "account" drop constraint "account_fee_uuid_foreign";');

    this.addSql('alter table "user" drop constraint "user_contact_uuid_foreign";');

    this.addSql('alter table "user" drop constraint "user_current_client_uuid_foreign";');

    this.addSql('alter table "client_document" drop constraint "client_document_client_uuid_foreign";');

    this.addSql('alter table "user_clients" drop constraint "user_clients_client_uuid_foreign";');

    this.addSql('alter table "user_clients" drop constraint "user_clients_client_uuid_foreign";');

    this.addSql('alter table "user_clients_metadata" drop constraint "user_clients_metadata_user_client_uuid_foreign";');

    this.addSql('drop table if exists "bank_metadata" cascade;');

    this.addSql('drop table if exists "business_metadata" cascade;');

    this.addSql('drop table if exists "individual_metadata" cascade;');

    this.addSql('drop table if exists "request_access" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "document" cascade;');

    this.addSql('drop table if exists "account" cascade;');

    this.addSql('drop table if exists "shareholder" cascade;');

    this.addSql('drop table if exists "risk_assessment" cascade;');

    this.addSql('drop table if exists "pending_meta_data" cascade;');

    this.addSql('drop table if exists "invitation" cascade;');

    this.addSql('drop table if exists "fee" cascade;');

    this.addSql('drop table if exists "director" cascade;');

    this.addSql('drop table if exists "contact" cascade;');

    this.addSql('drop table if exists "client" cascade;');

    this.addSql('drop table if exists "client_document" cascade;');

    this.addSql('drop table if exists "broker" cascade;');

    this.addSql('drop table if exists "beneficiary" cascade;');

    this.addSql('drop table if exists "user_clients" cascade;');

    this.addSql('drop table if exists "user_clients_metadata" cascade;');

    this.addSql('drop table if exists "user_document" cascade;');
  }

}
