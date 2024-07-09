import { Migration } from '@mikro-orm/migrations';

export class Migration20220519140235 extends Migration {

  async up(): Promise<void> {
    this.addSql(
      "update user set verified_at = '2022-04-10 06:42:43' where username = 'dbirbeck@pginternational.co.uk';",
    );
  }

}
