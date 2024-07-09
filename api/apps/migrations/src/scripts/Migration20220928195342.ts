import { Migration } from '@mikro-orm/migrations';

export class Migration20220928195342 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `account_number` varchar(255), modify `sort_code` varchar(255);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `account_number` int, modify `sort_code` int;');
  }

}
