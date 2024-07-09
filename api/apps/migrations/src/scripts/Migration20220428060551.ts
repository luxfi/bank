import { Migration } from '@mikro-orm/migrations';

export class Migration20220428060551 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if EXISTS `account_brokers`;');
    this.addSql(
      'create table `account_brokers` (`uuid` int not null AUTO_INCREMENT, `created_at` datetime not null, `updated_at` datetime not null, `account_uuid` varchar(36) null, `broker_uuid` varchar(36) null, PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql('alter table `account_brokers` add `comments` varchar(5000);');
    this.addSql(
      'alter table `account_brokers` add constraint `account_broker_broker_uuid_foreign` foreign key (`broker_uuid`) references `broker` (`uuid`) on update cascade on delete set null;',
    );
    this.addSql(
      'alter table `account_brokers` add constraint `account_broker_account_uuid_foreign` foreign key (`account_uuid`) references `account` (`uuid`) on update cascade on delete set null;',
    );
  }
}
