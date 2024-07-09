import { Migration } from '@mikro-orm/migrations';

export class Migration20221017094444 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `contact` modify `comply_launch_response` varchar(64);');

    this.addSql('alter table `beneficiary` add `open_payd_id` varchar(255) null;');
    this.addSql('alter table `beneficiary` modify `comply_launch_response` varchar(64);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `comply_launch_response` text;');
    this.addSql('alter table `beneficiary` drop `open_payd_id`;');

    this.addSql('alter table `contact` modify `comply_launch_response` blob;');
  }

}
