import { Migration } from '@mikro-orm/migrations';

export class Migration20220217192636 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `business_metadata` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `company_name` varchar(255) not null, `trading_name` varchar(255) null, `website_url` varchar(255) not null, `nature_of_business` varchar(255) not null, `company_registration_number` varchar(255) not null, `is_vat_registered` tinyint(1) not null, `vat_number` varchar(255) null, `is_publicly_trading` tinyint(1) not null, `stock_market_location` varchar(255) null, `stock_market` varchar(255) null, `is_regulated` tinyint(1) not null, `regulator_name` varchar(255) null, primary key `business_metadata_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      "create table `individual_metadata` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `title` varchar(255) not null, `firstname` varchar(255) not null, `lastname` varchar(255) not null, `former_name` varchar(255) null, `other_name` varchar(255) null, `date_of_birth` datetime not null, `address_line1` varchar(255) not null, `place_of_birth` varchar(255) not null, `address_line2` varchar(255) null, `city` varchar(255) not null, `postcode` varchar(255) not null, `country` varchar(255) not null, `previous_address_line1` varchar(255) null, `previous_address_line2` varchar(255) null, `previous_city` varchar(255) null, `previous_postcode` varchar(255) null, `previous_country` varchar(255) null, `nationality` varchar(255) not null, `gender` varchar(255) not null default 'other', `identification_number` varchar(255) null, `identification_type` varchar(255) not null default 'none', `occupation` varchar(255) not null, primary key `individual_metadata_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      'create table `bank_metadata` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `bank_name` varchar(255) not null, `branch` varchar(255) not null, `bank_country` varchar(255) not null, `account_holder_name` varchar(255) not null, `sort_code` varchar(255) not null, `account_number` varchar(255) not null, `iban` varchar(255) not null, primary key `bank_metadata_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      "alter table `account` add `entity_type` varchar(255) not null default 'individual', add `expected_volume_of_transactions` varchar(255) null, add `expected_value_of_turnover` varchar(255) null, add `bank_metadata_uuid` varchar(36) null, add `individual_metadata_uuid` varchar(36) null, add `business_metadata_uuid` varchar(36) null, add `comply_launch_id` varchar(255) null;",
    );

    this.addSql(
      'alter table `account` add index `account_bank_metadata_uuid_index`(`bank_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add unique `account_bank_metadata_uuid_unique`(`bank_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add index `account_individual_metadata_uuid_index`(`individual_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add unique `account_individual_metadata_uuid_unique`(`individual_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add index `account_business_metadata_uuid_index`(`business_metadata_uuid`);',
    );
    this.addSql(
      'alter table `account` add unique `account_business_metadata_uuid_unique`(`business_metadata_uuid`);',
    );

    this.addSql('alter table `contact` drop `entity_type`;');

    this.addSql(
      'alter table `user` change `full_name` `firstname` varchar(255) not null;',
    );

    this.addSql('alter table `user` add `lastname` varchar(255) not null;');

    this.addSql(
      'alter table `account` add constraint `account_bank_metadata_uuid_foreign` foreign key (`bank_metadata_uuid`) references `bank_metadata` (`uuid`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `account` add constraint `account_individual_metadata_uuid_foreign` foreign key (`individual_metadata_uuid`) references `individual_metadata` (`uuid`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `account` add constraint `account_business_metadata_uuid_foreign` foreign key (`business_metadata_uuid`) references `business_metadata` (`uuid`) on update cascade on delete cascade;',
    );
  }
}
