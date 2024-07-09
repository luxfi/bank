import { Migration } from '@mikro-orm/migrations';

export class Migration20220429111751 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `director` (`uuid` int not null AUTO_INCREMENT, `full_name` varchar(255) null, `dob` datetime null, `occupation` varchar(255) null, `telephone_number` varchar(255) null, `email` varchar(255) null, `nationality` varchar(255) null, `address1` varchar(255) null, `address2` varchar(255) null, `previous_address1` varchar(255) null, `previous_address2` varchar(255) null, `country` varchar(255) null, `account_uuid` varchar(36) null, PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `director` add constraint `director_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );
    this.addSql(
      'create table `shareholder` (`uuid` int not null AUTO_INCREMENT, `full_name` varchar(255) null, `dob` datetime null, `occupation` varchar(255) null, `telephone_number` varchar(255) null, `email` varchar(255) null, `nationality` varchar(255) null, `shares` numeric(4, 2) null, `address1` varchar(255) null, `address2` varchar(255) null, `previous_address1` varchar(255) null, `previous_address2` varchar(255) null, `country` varchar(255) null, `account_uuid` varchar(36) null, PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `shareholder` add constraint `shareholder_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );
  }
}
