import { Migration } from '@mikro-orm/migrations';

export class Migration20220501132701 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `broker` add `account_uuid` varchar(36) null;');
    this.addSql(
      'alter table `broker` add constraint `broker_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete cascade;',
    );
  }
}
