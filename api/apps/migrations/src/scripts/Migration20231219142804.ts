import { Migration } from '@mikro-orm/migrations';

export class Migration20231219142804 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists `client` (`uuid` varchar(36) not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp on update current_timestamp, `deleted_at` datetime null, `email` varchar(255) not null, `firstname` varchar(255) not null, `lastname` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql('alter table `client` add `account_uuid` varchar(36) null;');

    this.addSql(
      'alter table `client` add constraint `client_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );

    this.addSql(
      'create table if not exists `user_client` (`user_uuid` varchar(36) not null, `client_uuid` varchar(36) not null) default character set utf8mb4 engine = InnoDB;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `client`;');
    this.addSql('drop table if exists `user_client`;');
  }
}
