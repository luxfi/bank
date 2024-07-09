import { Migration } from '@mikro-orm/migrations';

export class Migration20221005145500 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `account` drop index `account_risk_assessment_uuid_index`;');
    this.addSql('alter table `account` drop `risk_assessment_uuid`;');

    this.addSql('alter table `director` modify `uuid` varchar(36) not null;');

    this.addSql('alter table `broker` add constraint `broker_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;');

    this.addSql('alter table `shareholder` modify `uuid` int unsigned not null auto_increment;');

    this.addSql('alter table `contact` drop index `contact_risk_assessment_uuid_unique`;');
    this.addSql('alter table `contact` drop index `contact_risk_assessment_uuid_index`;');
    this.addSql('alter table `contact` drop `risk_assessment_uuid`;');
    this.addSql('alter table `contact` add constraint `contact_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `broker` drop foreign key `broker_account_uuid_foreign`;');

    this.addSql('alter table `contact` drop foreign key `contact_account_uuid_foreign`;');

    this.addSql('alter table `account` add `risk_assessment_uuid` varchar(36) null;');
    this.addSql('alter table `account` add index `account_risk_assessment_uuid_index`(`risk_assessment_uuid`);');

    this.addSql('alter table `contact` add `risk_assessment_uuid` varchar(36) null;');
    this.addSql('alter table `contact` add unique `contact_risk_assessment_uuid_unique`(`risk_assessment_uuid`);');
    this.addSql('alter table `contact` add index `contact_risk_assessment_uuid_index`(`risk_assessment_uuid`);');

    this.addSql('alter table `director` modify `uuid` int unsigned not null;');

    this.addSql('alter table `shareholder` modify `uuid` int unsigned not null;');
  }

}
