import { Migration } from '@mikro-orm/migrations';

export class Migration20220421110455 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `broker` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(50) null, `address` varchar(255), `kyc` varchar(255), `client` varchar(255), `percentage_split` numeric(4, 2), `payment` varchar(10), `bank_account` varchar(50), `contract` varchar(100), PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
  }
  async down(): Promise<void> {
    this.addSql('drop table `broker`;');
  }
}
