import { Migration } from '@mikro-orm/migrations';

export class Migration20211230175026 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `beneficiary` (`uuid` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `customer_loan_base_balance` int(11) null, `customer_credit_limit` int(11) null, `customer_expected_installment_amount` int(11) null, `counter_part_id` varchar(255) null, `name` varchar(255) null, `entity_type` varchar(255) null, `account_number` int(11) null, `sort_code` int(11) null, `date_of_birth` datetime null, `country` varchar(255) null, `bank_country` varchar(255) null, `state` varchar(255) null, `address` varchar(255) null, `city` varchar(255) null, `postcode` varchar(255) null, `reference` varchar(255) null, `institution_id` varchar(255) null, `institution_name` varchar(255) null, `iban` varchar(255) null, `bic_swift` varchar(255) null, `company_name` varchar(255) null, PRIMARY KEY (`uuid`)) default character set utf8mb4 engine = InnoDB;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table `beneficiary`;');
  }
}
