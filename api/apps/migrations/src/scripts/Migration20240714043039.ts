import { Migration } from '@mikro-orm/migrations';
import { hash } from 'bcryptjs';
import { v4 } from 'uuid';

export class Migration20240714043039 extends Migration {

  async up(): Promise<void> {
    // this.addSql(
    //   'create table `user` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `username` varchar(255) not null, `password` varchar(255) not null, primary key `user_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    // );
    // this.addSql(
    //   'alter table `user` add unique `user_username_unique`(`username`);',
    // );

    const id = v4();
    const initialAdminPassword = await hash('Ninja1022!@#', 8);
    const initialAdminEmail = 'duongchristopher33@gmail.com';
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.addSql(
      `insert into \`user\` (uuid, created_at, updated_at, username, password, firstname, lastname) values ('${id}', '${date}', '${date}', '${initialAdminEmail}', '${initialAdminPassword}', 'Duong', 'Christopher');`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table `user`;');
  }

}
