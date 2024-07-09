import { Migration } from '@mikro-orm/migrations';

export class Migration20220927193047 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `contact` modify `comply_launch_response` blob;');

    this.addSql('alter table `beneficiary` modify `comply_launch_response` blob;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `contact` modify `comply_launch_response` text;');

    this.addSql('alter table `beneficiary` modify `comply_launch_response` text;');
  }

}
