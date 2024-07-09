import { Migration } from '@mikro-orm/migrations';

export class Migration20220930144926 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `account_number` varchar(16), modify `sort_code` varchar(6);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `beneficiary` modify `account_number` varchar(255), modify `sort_code` varchar(255);');
  }

}
