import { Migration } from '@mikro-orm/migrations';

export class Migration20220228112437 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `contact` add `is_approved` tinyint(1) not null;');

    this.addSql(
      'create table `document` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `original_filename` varchar(255) not null, `own_cloud_path` varchar(255) not null, `creator_uuid` varchar(36) null, primary key `document_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `document` add index `document_creator_uuid_index`(`creator_uuid`);',
    );

    this.addSql(
      'create table `user_document` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `is_approved` tinyint(1) not null, `type` varchar(255) not null, `document_uuid` varchar(36) null, `user_uuid` varchar(36) null, `expiry_date` datetime not null, primary key `user_document_pkey`(`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `user_document` add index `user_document_document_uuid_index`(`document_uuid`);',
    );
    this.addSql(
      'alter table `user_document` add unique `user_document_document_uuid_unique`(`document_uuid`);',
    );
    this.addSql(
      'alter table `user_document` add index `user_document_user_uuid_index`(`user_uuid`);',
    );

    this.addSql(
      'alter table `document` add constraint `document_creator_uuid_foreign` foreign key (`creator_uuid`) references `user` (`uuid`) on update cascade on delete set null;',
    );

    this.addSql(
      'alter table `user_document` add constraint `user_document_document_uuid_foreign` foreign key (`document_uuid`) references `document` (`uuid`) on update cascade on delete set null;',
    );
    this.addSql(
      'alter table `user_document` add constraint `user_document_user_uuid_foreign` foreign key (`user_uuid`) references `user` (`uuid`) on update cascade on delete set null;',
    );
  }
}
