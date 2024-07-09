import { Migration } from '@mikro-orm/migrations';

export class Migration20221221182427 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `bank_metadata` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `business_metadata` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `individual_metadata` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `mobile_verification_entity` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `user` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `transaction` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `session` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `fee` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `account` add `open_payd_id` varchar(255) null, add `is_approved` tinyint(1) null default 0;');
    this.addSql('alter table `account` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `shareholder` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `risk_assessment` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `invitation` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `director` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `contact` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `broker` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `document` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `beneficiary` modify `updated_at` datetime not null default current_timestamp on update current_timestamp, modify `is_approved` tinyint(1) default 0;');

    this.addSql('alter table `user_document` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `account` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');
    this.addSql('alter table `account` drop `open_payd_id`;');
    this.addSql('alter table `account` drop `is_approved`;');

    this.addSql('alter table `bank_metadata` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `beneficiary` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP, modify `is_approved` tinyint(1);');

    this.addSql('alter table `broker` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `business_metadata` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `contact` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `director` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `document` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `fee` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `individual_metadata` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `invitation` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `mobile_verification_entity` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `risk_assessment` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `session` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `shareholder` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `transaction` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `user` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');

    this.addSql('alter table `user_document` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP;');
  }

}
