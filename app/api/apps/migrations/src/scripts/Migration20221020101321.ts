import { Migration } from '@mikro-orm/migrations';

export class Migration20221020101321 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `business_metadata` add `company_type` enum(\'LIMITED_LIABILITY\', \'SOLE_TRADER\', \'PARTNERSHIP\', \'CHARITY\', \'JOINT_STOCK_COMPANY\', \'PUBLIC_LIMITED_COMPANY\') not null;');
    this.addSql('alter table `business_metadata` modify `company_name` varchar(255) null, modify `website_url` varchar(255) null, modify `nature_of_business` varchar(255) null, modify `company_registration_number` varchar(255) null, modify `is_vat_registered` tinyint(1) null, modify `is_publicly_trading` tinyint(1) not null default false, modify `is_regulated` tinyint(1) not null default false;');

    this.addSql('alter table `shareholder` add `company_type` enum(\'LIMITED_LIABILITY\', \'SOLE_TRADER\', \'PARTNERSHIP\', \'CHARITY\', \'JOINT_STOCK_COMPANY\', \'PUBLIC_LIMITED_COMPANY\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `business_metadata` modify `company_name` varchar(255) not null, modify `website_url` varchar(255) not null, modify `nature_of_business` varchar(255) not null, modify `company_registration_number` varchar(255) not null, modify `is_vat_registered` tinyint(1) not null, modify `is_publicly_trading` tinyint(1) not null, modify `is_regulated` tinyint(1) not null;');
    this.addSql('alter table `business_metadata` drop `company_type`;');

    this.addSql('alter table `shareholder` drop `company_type`;');
  }

}
