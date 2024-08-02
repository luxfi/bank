import { Migration } from '@mikro-orm/migrations';

export class Migration20240729064329 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "transaction" drop constraint "transaction_account_id_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_cdax_beneficiary_id_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_client_uuid_foreign";');
    this.addSql('alter table "transaction" drop constraint "transaction_approver_uuid_foreign";');

    this.addSql('alter table "transaction" alter column "account_id" type varchar(255) using ("account_id"::varchar(255));');
    this.addSql('alter table "transaction" alter column "account_id" set not null;');
    this.addSql('alter table "transaction" alter column "cdax_beneficiary_id" type varchar(255) using ("cdax_beneficiary_id"::varchar(255));');
    this.addSql('alter table "transaction" alter column "client_uuid" type varchar(255) using ("client_uuid"::varchar(255));');
    this.addSql('alter table "transaction" alter column "approver_uuid" type varchar(255) using ("approver_uuid"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "transaction" alter column "account_id" type varchar(36) using ("account_id"::varchar(36));');
    this.addSql('alter table "transaction" alter column "account_id" drop not null;');
    this.addSql('alter table "transaction" alter column "cdax_beneficiary_id" type varchar(36) using ("cdax_beneficiary_id"::varchar(36));');
    this.addSql('alter table "transaction" alter column "client_uuid" type varchar(36) using ("client_uuid"::varchar(36));');
    this.addSql('alter table "transaction" alter column "approver_uuid" type varchar(36) using ("approver_uuid"::varchar(36));');
    this.addSql('alter table "transaction" add constraint "transaction_account_id_foreign" foreign key ("account_id") references "account" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_cdax_beneficiary_id_foreign" foreign key ("cdax_beneficiary_id") references "beneficiary" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_client_uuid_foreign" foreign key ("client_uuid") references "client" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_approver_uuid_foreign" foreign key ("approver_uuid") references "user" ("uuid") on update cascade on delete set null;');
  }

}
