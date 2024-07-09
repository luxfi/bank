import { Migration } from '@mikro-orm/migrations';

export class Migration20221221123149 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `fee` (`uuid` varchar(36) not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp on update current_timestamp, `deleted_at` datetime null, `conversion_amount` varchar(255) null, `conversion_fee` varchar(255) null, `sepa_amount` varchar(255) null, `sepa_currency` varchar(255) null, `sepa_instant_amount` varchar(255) null, `sepa_instant_currency` varchar(255) null, `target2_amount` varchar(255) null, `target2_currency` varchar(255) null, `swift_amount` varchar(255) null, `swift_currency` varchar(255) null, `chaps_amount` varchar(255) null, `chaps_currency` varchar(255) null, `faster_payments_amount` varchar(255) null, `faster_payments_currency` varchar(255) null, `account_uuid` varchar(36) null, `updated_by_uuid` varchar(36) null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `fee` add index `fee_account_uuid_index`(`account_uuid`);');
    this.addSql('alter table `fee` add index `fee_updated_by_uuid_index`(`updated_by_uuid`);');

    this.addSql('alter table `fee` add constraint `fee_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;');
    this.addSql('alter table `fee` add constraint `fee_updated_by_uuid_foreign` foreign key (`updated_by_uuid`) references `user` (`uuid`) on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `fee`;');
  }

}
