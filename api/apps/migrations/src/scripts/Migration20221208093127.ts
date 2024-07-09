import { Migration } from '@mikro-orm/migrations';

export class Migration20221208093127 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `transaction` (`uuid` varchar(36) not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp on update current_timestamp, `deleted_at` datetime null, `account_id` varchar(255) not null, `balance_id` varchar(255) not null, `action` varchar(255) not null, `amount` varchar(255) not null, `currency` varchar(255) not null, `transaction_id` varchar(255) null, `short_id` varchar(255) not null, `gateway` varchar(255) not null, `reason` varchar(255) null, `reference` varchar(255) null, `status` varchar(255) not null, `fee_amount` varchar(255) null, `fee_currency` varchar(255) null, `client_rate` varchar(255) null, `core_rate` varchar(255) null, `creator_uuid` varchar(36) null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `transaction` add index `transaction_creator_uuid_index`(`creator_uuid`);');

    this.addSql('alter table `transaction` add constraint `transaction_creator_uuid_foreign` foreign key (`creator_uuid`) references `user` (`uuid`) on update cascade on delete set null;');

    this.addSql('alter table `user` add `two_fasecret` varchar(255) null, add `two_fa` tinyint(1) null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `transaction`;');

    this.addSql('alter table `user` drop `two_fasecret`;');
    this.addSql('alter table `user` drop `two_fa`;');
  }

}
