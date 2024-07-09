import { Migration } from '@mikro-orm/migrations';

export class Migration20220914094654 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `mobile_verification_entity` add `deleted_at` datetime null;');

    this.addSql('alter table `business_metadata` add `deleted_at` datetime null;');

    this.addSql('alter table `individual_metadata` add `deleted_at` datetime null;');
    this.addSql('alter table `individual_metadata` modify `gender` varchar(255) not null default \'other\', modify `identification_type` varchar(255) not null default \'none\';');

    this.addSql('alter table `bank_metadata` add `deleted_at` datetime null;');

    this.addSql('alter table `account` add `deleted_at` datetime null;');
    this.addSql('alter table `account` modify `entity_type` varchar(255) not null default \'individual\';');

    this.addSql('alter table `broker` add `deleted_at` datetime null;');

    this.addSql('alter table `risk_assessment` add `deleted_at` datetime null;');

    this.addSql('alter table `user` add `deleted_at` datetime null;');
    this.addSql('alter table `user` modify `role` varchar(255) default \'user:admin\';');

    this.addSql('alter table `invitation` add `deleted_at` datetime null;');
    this.addSql('alter table `invitation` modify `user_role` varchar(255) default \'user:team\';');

    this.addSql('alter table `contact` add `deleted_at` datetime null;');
    this.addSql('alter table `contact` modify `is_approved` tinyint(1) default false;');

    this.addSql('alter table `beneficiary` add `deleted_at` datetime null, add `comply_launch_response` varchar(10240) null;');

    this.addSql('alter table `document` add `deleted_at` datetime null;');

    this.addSql('alter table `user_document` add `deleted_at` datetime null;');
  }

}
