import { Migration } from '@mikro-orm/migrations';

export class Migration20220927192546 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `comply_launch_response` text;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `comply_launch_response` varchar(102400);');
  }

}
