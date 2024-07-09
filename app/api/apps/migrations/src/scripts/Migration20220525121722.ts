import { Migration } from '@mikro-orm/migrations';

export class Migration20220525121722 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `account` drop constraint `account_risk_assessment_uuid_foreign`, drop column `risk_assessment_uuid`;',
    );

    this.addSql(
      'alter table `risk_assessment` add `account_uuid` varchar(36) null;',
    );
    this.addSql(
      'alter table `risk_assessment` add constraint `risk_assessment_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );
  }
}
