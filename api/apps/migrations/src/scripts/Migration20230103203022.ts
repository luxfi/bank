import { Migration } from '@mikro-orm/migrations';

export class Migration20230103203022 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transaction` add `mid_market_rate` varchar(255) null, add `conversion_date` varchar(255) null, add `settlement_date` varchar(255) null, add `gateway_created_at` varchar(255) null, add `gateway_updated_at` varchar(255) null, add `partner_rate` varchar(255) null, add `deposit_required` tinyint(1) null, add `deposit_amount` varchar(255) null, add `deposit_currency` varchar(255) null, add `deposit_status` varchar(255) null, add `deposit_required_at` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transaction` drop `mid_market_rate`;');
    this.addSql('alter table `transaction` drop `conversion_date`;');
    this.addSql('alter table `transaction` drop `settlement_date`;');
    this.addSql('alter table `transaction` drop `gateway_created_at`;');
    this.addSql('alter table `transaction` drop `gateway_updated_at`;');
    this.addSql('alter table `transaction` drop `partner_rate`;');
    this.addSql('alter table `transaction` drop `deposit_required`;');
    this.addSql('alter table `transaction` drop `deposit_amount`;');
    this.addSql('alter table `transaction` drop `deposit_currency`;');
    this.addSql('alter table `transaction` drop `deposit_status`;');
    this.addSql('alter table `transaction` drop `deposit_required_at`;');
  }

}
