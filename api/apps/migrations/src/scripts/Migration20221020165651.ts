import { Migration } from '@mikro-orm/migrations';

export class Migration20221020165651 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `business_metadata` modify `is_publicly_trading` tinyint(1) null, modify `is_regulated` tinyint(1) null;');

    this.addSql('alter table `shareholder` add `business_metadata_uuid` varchar(36) null, add `individual_metadata_uuid` varchar(36) null, add `entity_type` varchar(255) null;');
    this.addSql('alter table `shareholder` add constraint `shareholder_business_metadata_uuid_foreign` foreign key (`business_metadata_uuid`) references `business_metadata` (`uuid`) on update cascade on delete set null;');
    this.addSql('alter table `shareholder` add constraint `shareholder_individual_metadata_uuid_foreign` foreign key (`individual_metadata_uuid`) references `individual_metadata` (`uuid`) on update cascade on delete set null;');
    this.addSql('alter table `shareholder` drop `company_type`;');
    this.addSql('alter table `shareholder` add unique `shareholder_business_metadata_uuid_unique`(`business_metadata_uuid`);');
    this.addSql('alter table `shareholder` add unique `shareholder_individual_metadata_uuid_unique`(`individual_metadata_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `shareholder` drop foreign key `shareholder_business_metadata_uuid_foreign`;');
    this.addSql('alter table `shareholder` drop foreign key `shareholder_individual_metadata_uuid_foreign`;');

    this.addSql('alter table `business_metadata` modify `is_publicly_trading` tinyint(1) not null default false, modify `is_regulated` tinyint(1) not null default false;');

    this.addSql('alter table `shareholder` add `company_type` enum(\'LIMITED_LIABILITY\', \'SOLE_TRADER\', \'PARTNERSHIP\', \'CHARITY\', \'JOINT_STOCK_COMPANY\', \'PUBLIC_LIMITED_COMPANY\') not null;');
    this.addSql('alter table `shareholder` drop index `shareholder_business_metadata_uuid_unique`;');
    this.addSql('alter table `shareholder` drop index `shareholder_individual_metadata_uuid_unique`;');
    this.addSql('alter table `shareholder` drop `business_metadata_uuid`;');
    this.addSql('alter table `shareholder` drop `individual_metadata_uuid`;');
    this.addSql('alter table `shareholder` drop `entity_type`;');
  }

}
