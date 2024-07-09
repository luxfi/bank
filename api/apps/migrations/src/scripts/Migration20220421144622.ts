import { Migration } from '@mikro-orm/migrations';

export class Migration20220421144622 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `user_broker` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `user_uuid` varchar(36) null, `broker_uuid` varchar(36) null, PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `user_broker` add constraint `user_broker_broker_uuid_foreign` foreign key (`broker_uuid`) references `broker` (`uuid`) on update cascade on delete set null;',
    );
    this.addSql(
      'alter table `user_broker` add constraint `user_broker_user_uuid_foreign` foreign key (`user_uuid`) references `user` (`uuid`) on update cascade on delete set null;',
    );
  }
}
