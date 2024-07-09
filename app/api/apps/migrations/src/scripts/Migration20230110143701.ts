import { Migration } from '@mikro-orm/migrations';

export class Migration20230110143701 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `pending_meta_data` (`uuid` varchar(36) not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp on update current_timestamp, `deleted_at` datetime null, `type` varchar(255) not null, `field` varchar(255) not null, `value` varchar(255) not null, `account_uuid` varchar(36) null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pending_meta_data` add index `pending_meta_data_account_uuid_index`(`account_uuid`);');

    this.addSql('alter table `pending_meta_data` add constraint `pending_meta_data_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `pending_meta_data`;');
  }

}
