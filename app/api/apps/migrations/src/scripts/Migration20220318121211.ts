import { Migration } from '@mikro-orm/migrations';

export class Migration20220318121211 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `individual_metadata` modify `gender` varchar(255) default 'other', modify `identification_type` varchar(255) default 'none';",
    );

    this.addSql(
      "alter table `account` modify `entity_type` varchar(255) default 'individual';",
    );

    this.addSql(
      "alter table `user` modify `role` varchar(255) not null default 'user:admin';",
    );

    this.addSql(
      'create table `invitation` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `email` varchar(255) not null, `firstname` varchar(255) not null, `lastname` varchar(255) not null, `secret` varchar(255) not null, `account_uuid` varchar(36) not null, `creator_uuid` varchar(36) not null, `expired_at` datetime null, primary key `invitation_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `invitation` add index `invitation_account_uuid_index`(`account_uuid`);',
    );
    this.addSql(
      'alter table `invitation` add index `invitation_creator_uuid_index`(`creator_uuid`);',
    );

    this.addSql(
      'alter table `invitation` add constraint `invitation_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade;',
    );
    this.addSql(
      'alter table `invitation` add constraint `invitation_creator_uuid_foreign` foreign key (`creator_uuid`) references `user` (`uuid`) on update cascade;',
    );
  }
}
