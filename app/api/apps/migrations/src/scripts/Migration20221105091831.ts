import { Migration } from '@mikro-orm/migrations';

export class Migration20221105091831 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `director` add `created_at` datetime not null DEFAULT CURRENT_TIMESTAMP, add `updated_at` datetime not null DEFAULT CURRENT_TIMESTAMP, add `deleted_at` datetime null;');

    this.addSql('alter table `shareholder` add `created_at` datetime not null DEFAULT CURRENT_TIMESTAMP, add `updated_at` datetime not null DEFAULT CURRENT_TIMESTAMP, add `deleted_at` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `director` drop `created_at`;');
    this.addSql('alter table `director` drop `updated_at`;');
    this.addSql('alter table `director` drop `deleted_at`;');

    this.addSql('alter table `shareholder` drop `created_at`;');
    this.addSql('alter table `shareholder` drop `updated_at`;');
    this.addSql('alter table `shareholder` drop `deleted_at`;');
  }

}
