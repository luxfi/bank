import { Migration } from '@mikro-orm/migrations';

export class Migration20221115074719 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `director` add `comply_launch_id` varchar(255) null, add `comply_launch_response` varchar(64) null;');
    this.addSql('alter table `broker` add `country` varchar(255) null, add `comply_launch_id` varchar(255) null, add `comply_launch_response` varchar(64) null;');
    this.addSql('alter table `shareholder` add `comply_launch_id` varchar(255) null, add `comply_launch_response` varchar(64) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `broker` drop `country`;');
    this.addSql('alter table `broker` drop `comply_launch_id`;');
    this.addSql('alter table `broker` drop `comply_launch_response`;');

    this.addSql('alter table `director` drop `comply_launch_id`;');
    this.addSql('alter table `director` drop `comply_launch_response`;');

    this.addSql('alter table `shareholder` drop `comply_launch_id`;');
    this.addSql('alter table `shareholder` drop `comply_launch_response`;');
  }

}
