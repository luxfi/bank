import { Migration } from '@mikro-orm/migrations';

export class Migration20240729142902 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "transaction" drop constraint "transaction_creator_uuid_foreign";');

    this.addSql('alter table "transaction" add column "account" varchar(36) null, add column "beneficiary" varchar(36) null, add column "creator" varchar(36) null, add column "client" varchar(36) null, add column "approver" varchar(36) null;');
    this.addSql('alter table "transaction" alter column "creator_uuid" type varchar(255) using ("creator_uuid"::varchar(255));');
    this.addSql('alter table "transaction" add constraint "transaction_account_foreign" foreign key ("account") references "account" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_beneficiary_foreign" foreign key ("beneficiary") references "beneficiary" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_creator_foreign" foreign key ("creator") references "user" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_client_foreign" foreign key ("client") references "client" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_approver_foreign" foreign key ("approver") references "user" ("uuid") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "transaction" drop constraint "transaction_account_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_beneficiary_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_creator_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_client_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_approver_foreign";');

    this.addSql('alter table "transaction" drop column "account", drop column "beneficiary", drop column "creator", drop column "client", drop column "approver";');

    this.addSql('alter table "transaction" alter column "creator_uuid" type varchar(36) using ("creator_uuid"::varchar(36));');
    this.addSql('alter table "transaction" add constraint "transaction_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade on delete set null;');
  }

}
