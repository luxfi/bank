import { Migration } from '@mikro-orm/migrations';

export class Migration20220209222959 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` add `comply_launch_id` varchar(255) null, add `currency_cloud_id` varchar(255) null, add `account_uuid` varchar(36) null;',
    );
    this.addSql(
      'alter table `beneficiary` add index `beneficiary_account_uuid_index`(`account_uuid`);',
    );

    this.addSql(
      'alter table `beneficiary` add constraint `beneficiary_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` drop index `beneficiary_account_uuid_index`, drop constraint `beneficiary_account_uuid_foreign`, drop column `comply_launch_id`, drop column `currency_cloud_id`, drop column `account_uuid`;',
    );
  }
}
