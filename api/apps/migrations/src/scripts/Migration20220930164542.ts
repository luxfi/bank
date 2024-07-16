import { Migration } from '@mikro-orm/migrations';

export class Migration20220930164542 extends Migration {

  async up(): Promise<void> {
    // this.addSql('alter table `risk_assessment` add `account_uuid` varchar(36) null;');
    // this.addSql('alter table `risk_assessment` add constraint `risk_assessment_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;');
    this.addSql('alter table `risk_assessment` add index `risk_assessment_account_uuid_index`(`account_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `risk_assessment` drop foreign key `risk_assessment_account_uuid_foreign`;');

    this.addSql('alter table `risk_assessment` drop index `risk_assessment_account_uuid_index`;');
    this.addSql('alter table `risk_assessment` drop `account_uuid`;');
  }

}
