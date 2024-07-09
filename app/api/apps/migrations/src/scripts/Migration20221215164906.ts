import { Migration } from '@mikro-orm/migrations';

export class Migration20221215164906 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `session` (`uuid` varchar(36) not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp on update current_timestamp, `deleted_at` datetime null, `ip` varchar(255) null, `user_agent` varchar(255) null, `fingerprint` varchar(255) null, `user_uuid` varchar(36) null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `session` add index `session_user_uuid_index`(`user_uuid`);');

    this.addSql('alter table `session` add constraint `session_user_uuid_foreign` foreign key (`user_uuid`) references `user` (`uuid`) on update cascade on delete set null;');

    this.addSql('alter table `transaction` add `purpose_code` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `session`;');

    this.addSql('alter table `transaction` drop `purpose_code`;');
  }

}
