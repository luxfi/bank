import { Migration } from '@mikro-orm/migrations';

export class Migration20220927192739 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `contact` modify `comply_launch_response` text;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `contact` modify `comply_launch_response` varchar(10240);');
  }

}
