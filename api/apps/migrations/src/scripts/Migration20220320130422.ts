import { Migration } from '@mikro-orm/migrations';

export class Migration20220320130422 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `contact` add `expected_volume_of_transactions` varchar(255) null, add `expected_value_of_turnover` varchar(255) null, add `is_sub_account` tinyint(1) not null default false, add `comply_launch_id` varchar(255) null, add `bank_metadata_uuid` varchar(36) null, add `individual_metadata_uuid` varchar(36) null, add `invitation_uuid` varchar(36) null;',
    );
    this.addSql(
      'alter table `contact` modify `is_approved` tinyint(1) not null;',
    );
    this.addSql(
      'alter table `contact` add index `contact_bank_metadata_uuid_index`(`bank_metadata_uuid`);',
    );
    this.addSql(
      'alter table `contact` add unique `contact_bank_metadata_uuid_unique`(`bank_metadata_uuid`);',
    );
    this.addSql(
      'alter table `contact` add index `contact_individual_metadata_uuid_index`(`individual_metadata_uuid`);',
    );
    this.addSql(
      'alter table `contact` add unique `contact_individual_metadata_uuid_unique`(`individual_metadata_uuid`);',
    );
    this.addSql(
      'alter table `contact` add index `contact_invitation_uuid_index`(`invitation_uuid`);',
    );
    this.addSql(
      'alter table `contact` add unique `contact_invitation_uuid_unique`(`invitation_uuid`);',
    );

    this.addSql(
      'alter table `contact` add constraint `contact_bank_metadata_uuid_foreign` foreign key (`bank_metadata_uuid`) references `bank_metadata` (`uuid`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `contact` add constraint `contact_individual_metadata_uuid_foreign` foreign key (`individual_metadata_uuid`) references `individual_metadata` (`uuid`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `contact` add constraint `contact_invitation_uuid_foreign` foreign key (`invitation_uuid`) references `invitation` (`uuid`) on update cascade on delete cascade;',
    );

    this.addSql(
      "alter table `invitation` add `user_role` varchar(255) not null default 'user:team';",
    );

    this.addSql(
      'update `contact` c join `account` a on `c`.`account_uuid` = `a`.`uuid` SET ' +
        '`c` .`expected_volume_of_transactions` = `a`.`expected_volume_of_transactions`, ' +
        '`c` .`expected_value_of_turnover` = `a`.`expected_value_of_turnover`, ' +
        '`c` .`comply_launch_id` = `a`.`comply_launch_id`',
    );

    this.addSql('alter table `account` drop `comply_launch_id`;');
    this.addSql('alter table `account` drop `expected_value_of_turnover`;');
    this.addSql(
      'alter table `account` drop `expected_volume_of_transactions`;',
    );
  }
}
