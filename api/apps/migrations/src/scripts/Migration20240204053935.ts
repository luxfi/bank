import { Migration } from '@mikro-orm/migrations';

export class Migration20240204053935 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user_clients_metadata` (`uuid` varchar(36) not null, `user_client_uuid` varchar(36) not null, `role` varchar(255) not null default \'user:admin\', `who_they_are` varchar(255) null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `user_clients_metadata`;');
  }
}
