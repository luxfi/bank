import { Migration } from '@mikro-orm/migrations';

export class Migration20220914181351 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `individual_metadata` modify `gender` varchar(255) default \'other\', modify `identification_type` varchar(255) default \'none\';');

    this.addSql('alter table `account` modify `entity_type` varchar(255) default \'individual\';');

    this.addSql('alter table `user` modify `role` varchar(255) not null default \'user:admin\';');

    this.addSql('alter table `invitation` modify `user_role` varchar(255) not null default \'user:team\';');

    this.addSql('alter table `contact` add `comply_launch_response` varchar(10240) null;');
    this.addSql('alter table `contact` modify `is_approved` tinyint(1) not null;');
  }

}
