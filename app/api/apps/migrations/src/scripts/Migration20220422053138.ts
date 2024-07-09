import { Migration } from '@mikro-orm/migrations';

export class Migration20220422053138 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `account` add `risk_assessment_uuid` varchar(36) null;',
    );
    this.addSql(
      'alter table `account` add constraint `account_risk_assessment_uuid_foreign` foreign key (`risk_assessment_uuid`) references `risk_assessment` (`uuid`) on update cascade on delete set null;',
    );
  }
}
