import { Migration } from '@mikro-orm/migrations';

export class Migration20220118135724 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `mobile_verification_entity` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `mobile_number` varchar(255) not null, `code` varchar(255) not null, primary key `mobile_verification_entity_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      'alter table `user` add `full_name` varchar(255) not null, add `entity_type` varchar(255) not null, add `business_role` varchar(255) null, add `country` varchar(255) not null, add `mobile_number` varchar(255) null;',
    );
    this.addSql('alter table `user` modify `password` varchar(255) null;');
    this.addSql(
      'alter table `user` add unique `user_mobile_number_unique`(`mobile_number`);',
    );

    this.addSql(
      'alter table `beneficiary` add `creator_uuid` varchar(36) null;',
    );
    this.addSql(
      'alter table `beneficiary` add index `beneficiary_creator_uuid_index`(`creator_uuid`);',
    );

    this.addSql(
      'alter table `beneficiary` add constraint `beneficiary_creator_uuid_foreign` foreign key (`creator_uuid`) references `user` (`uuid`) on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `mobile_verification_entity`;');

    this.addSql('alter table `user` drop index `user_mobile_number_unique`;');

    this.addSql(
      'alter table `user` drop `full_name`, drop `entity_type`, drop `business_role`, drop `country`, drop `mobile_number`;',
    );

    this.addSql(
      'alter table `beneficiary` DROP FOREIGN KEY `beneficiary_creator_uuid_foreign`',
    );

    this.addSql(
      'alter table `beneficiary` drop index `beneficiary_creator_uuid_index`;',
    );

    this.addSql('alter table `beneficiary` drop `creator_uuid`;');
  }
}
