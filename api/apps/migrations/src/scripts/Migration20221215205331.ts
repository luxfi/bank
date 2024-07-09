import { Migration } from '@mikro-orm/migrations';

export class Migration20221215205331 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `sort_code` varchar(18);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `sort_code` varchar(6);');
  }

}
