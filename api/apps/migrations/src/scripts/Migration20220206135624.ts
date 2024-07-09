import { Migration } from '@mikro-orm/migrations';

export class Migration20220206135624 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `account` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `cloud_currency_id` varchar(255) null, primary key `account_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      "create table `contact` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `cloud_currency_id` varchar(255) null, `entity_type` varchar(255) not null default 'individual', `business_role` varchar(255) null, `country` varchar(255) not null, `mobile_number` varchar(255) null, `account_uuid` varchar(36) null, primary key `contact_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql(
      'alter table `contact` add unique `contact_mobile_number_unique`(`mobile_number`);',
    );
    this.addSql(
      'alter table `contact` add index `contact_account_uuid_index`(`account_uuid`);',
    );

    this.addSql('alter table `user` add `contact_uuid` varchar(36) null;');
    this.addSql(
      "alter table `user` modify `role` varchar(255) default 'user:admin';",
    );
    this.addSql(
      'alter table `user` add index `user_contact_uuid_index`(`contact_uuid`);',
    );
    this.addSql(
      'alter table `user` add unique `user_contact_uuid_unique`(`contact_uuid`);',
    );

    // create contacts for current users.
    this.addSql(
      'update `user` set contact_uuid = (select uuid()) where contact_uuid is null;',
    );
    this.addSql(
      'insert into `contact` (uuid, business_role, country, entity_type, mobile_number, created_at, updated_at) select contact_uuid as uuid, business_role, country, entity_type, mobile_number, now(), now() from `user` where contact_uuid is not null;',
    );

    this.addSql('alter table `user` drop `business_role`;');
    this.addSql('alter table `user` drop `country`;');
    this.addSql('alter table `user` drop `entity_type`;');
    this.addSql('alter table `user` drop index `user_mobile_number_unique`;');
    this.addSql('alter table `user` drop `mobile_number`;');

    this.addSql(
      'alter table `contact` add constraint `contact_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade;',
    );

    this.addSql(
      'alter table `user` add constraint `user_contact_uuid_foreign` foreign key (`contact_uuid`) references `contact` (`uuid`) on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `user` add `business_role` varchar(255) null, add `country` varchar(255) not null, add `mobile_number` varchar(255) null, add `entity_type` varchar(255) not null;',
    );

    // move data back to the user table.
    this.addSql(
      'UPDATE `user` u JOIN `contact` c ON (u.contact_uuid = c.uuid) set u.business_role = c.business_role, u.country = c.country, u.mobile_number = c.mobile_number, u.entity_type = c.entity_type where u.mobile_number is null;',
    );

    this.addSql(
      'alter table `user` add unique `user_mobile_number_unique`(`mobile_number`);',
    );

    this.addSql(
      'alter table `user` drop index `user_contact_uuid_index`, drop constraint `user_contact_uuid_foreign`, drop column `contact_uuid`;',
    );
    this.addSql('drop table `contact`;');
    this.addSql('drop table `account`;');
  }
}
