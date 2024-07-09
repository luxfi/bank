import { Migration } from '@mikro-orm/migrations';

export class Migration20221221171033 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `account` add `fee_uuid` varchar(36) null;');
    this.addSql('alter table `account` add constraint `account_fee_uuid_foreign` foreign key (`fee_uuid`) references `fee` (`uuid`) on update cascade on delete cascade;');
    this.addSql('alter table `account` add unique `account_fee_uuid_unique`(`fee_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `account` drop foreign key `account_fee_uuid_foreign`;');

    this.addSql('alter table `account` drop index `account_fee_uuid_unique`;');
    this.addSql('alter table `account` drop `fee_uuid`;');
  }

}
