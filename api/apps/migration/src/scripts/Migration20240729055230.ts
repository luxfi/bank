import { Migration } from '@mikro-orm/migrations';

export class Migration20240729055230 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "transaction" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "account_id" varchar(36) null, "balance_id" varchar(255) null, "destination_balance_id" varchar(255) null, "action" varchar(255) not null, "amount" varchar(255) not null, "buy_amount" varchar(255) null, "currency" varchar(255) not null, "buy_currency" varchar(255) null, "fixed_side" varchar(255) null, "transaction_id" varchar(255) null, "short_id" varchar(255) not null, "cdax_id" varchar(255) not null, "gateway" varchar(255) not null, "gateway_id" varchar(255) null, "reason" varchar(255) null, "reference" varchar(255) null, "status" varchar(255) not null, "fee_amount" varchar(255) null, "fee_currency" varchar(255) null, "gateway_fee_amount" varchar(255) null, "gateway_fee_currency" varchar(255) null, "client_rate" varchar(255) null, "core_rate" varchar(255) null, "cdax_beneficiary_id" varchar(36) null, "beneficiary_id" varchar(255) null, "payment_date" varchar(255) null, "payment_type" varchar(255) null, "payment_reason" varchar(255) null, "purpose_code" varchar(255) null, "status_approval" text check ("status_approval" in (\'pending\', \'done\', \'rejected\', \'expired\')) not null, "description" varchar(255) null, "source" varchar(255) null, "destination" varchar(255) null, "sender_name" varchar(255) null, "sender_address" varchar(255) null, "sender_information" varchar(255) null, "sender_account_number" varchar(255) null, "sender_bic" varchar(255) null, "sender_iban" varchar(255) null, "sender_routing_key" varchar(255) null, "sender_routing_value" varchar(255) null, "mid_market_rate" varchar(255) null, "conversion_date" varchar(255) null, "settlement_date" varchar(255) null, "gateway_created_at" varchar(255) null, "gateway_updated_at" varchar(255) null, "gateway_completed_at" varchar(255) null, "gateway_spread_table" varchar(255) null, "partner_rate" varchar(255) null, "deposit_required" boolean null, "deposit_amount" varchar(255) null, "deposit_currency" varchar(255) null, "deposit_status" varchar(255) null, "deposit_required_at" varchar(255) null, "estimated_arrival" varchar(255) null, "transferred_at" varchar(255) null, "creator_uuid" varchar(36) null, "client_uuid" varchar(36) null, "impersonator_uuid" varchar(255) null, "approver_uuid" varchar(36) null, constraint "transaction_pkey" primary key ("uuid"));');

    this.addSql('alter table "transaction" add constraint "transaction_account_id_foreign" foreign key ("account_id") references "account" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_cdax_beneficiary_id_foreign" foreign key ("cdax_beneficiary_id") references "beneficiary" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_client_uuid_foreign" foreign key ("client_uuid") references "client" ("uuid") on update cascade on delete set null;');
    this.addSql('alter table "transaction" add constraint "transaction_approver_uuid_foreign" foreign key ("approver_uuid") references "user" ("uuid") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "transaction" cascade;');
  }

}
