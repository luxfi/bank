import { Migration } from '@mikro-orm/migrations';

export class Migration20221129221107 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user_document` drop foreign key `user_document_user_uuid_foreign`;');

    this.addSql('alter table `bank_metadata` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `business_metadata` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `individual_metadata` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `account` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `director` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `broker` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `mobile_verification_entity` add `ip` varchar(255) not null;');
    this.addSql('alter table `mobile_verification_entity` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `risk_assessment` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `shareholder` modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `user` add `ip` varchar(255) null;');
    this.addSql('alter table `user` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `invitation` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `contact` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `document` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `beneficiary` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp;');

    this.addSql('alter table `user_document` modify `created_at` datetime not null default current_timestamp, modify `updated_at` datetime not null default current_timestamp on update current_timestamp, modify `is_approved` tinyint(1) not null default false, modify `user_uuid` varchar(36) not null, modify `status` varchar(255);');
    this.addSql('alter table `user_document` add constraint `user_document_user_uuid_foreign` foreign key (`user_uuid`) references `user` (`uuid`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user_document` drop foreign key `user_document_user_uuid_foreign`;');

    this.addSql('alter table `account` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `bank_metadata` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `beneficiary` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `broker` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `business_metadata` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `contact` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `director` modify `updated_at` datetime not null default CURRENT_TIMESTAMP;');

    this.addSql('alter table `document` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `individual_metadata` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `invitation` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `mobile_verification_entity` modify `created_at` datetime not null, modify `updated_at` datetime not null;');
    this.addSql('alter table `mobile_verification_entity` drop `ip`;');

    this.addSql('alter table `risk_assessment` modify `created_at` datetime not null, modify `updated_at` datetime not null;');

    this.addSql('alter table `shareholder` modify `updated_at` datetime not null default CURRENT_TIMESTAMP;');

    this.addSql('alter table `user` modify `created_at` datetime not null, modify `updated_at` datetime not null;');
    this.addSql('alter table `user` drop `ip`;');

    this.addSql('alter table `user_document` modify `created_at` datetime not null, modify `updated_at` datetime not null, modify `is_approved` tinyint(1) not null, modify `status` varchar(10) null, modify `user_uuid` varchar(36) null;');
    this.addSql('alter table `user_document` add constraint `user_document_user_uuid_foreign` foreign key (`user_uuid`) references `user` (`uuid`) on update cascade on delete set null;');
  }

}
