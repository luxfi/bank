import { Migration } from '@mikro-orm/migrations';

export class Migration20220309095739 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `bank_metadata` modify `iban` varchar(255) null;');

    this.addSql('alter table `user_document` drop `expiry_date`;');
  }
}
