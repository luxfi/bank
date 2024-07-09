import { Migration } from '@mikro-orm/migrations';

export class Migration20220125195800 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` change `counter_part_id` `firstname` varchar(255) null;',
    );
    this.addSql(
      'alter table `beneficiary` change `name` `lastname` varchar(255) null;',
    );
    this.addSql(
      'alter table `beneficiary` change `state` `currency` varchar(255) null;',
    );
    this.addSql(
      'alter table `beneficiary` change `postcode` `payment_type` varchar(255) null;',
    );

    this.addSql('alter table `beneficiary` drop `customer_loan_base_balance`;');
    this.addSql('alter table `beneficiary` drop `customer_credit_limit`;');
    this.addSql(
      'alter table `beneficiary` drop `customer_expected_installment_amount`;',
    );
    this.addSql('alter table `beneficiary` drop `date_of_birth`;');
    this.addSql('alter table `beneficiary` drop `reference`;');
    this.addSql('alter table `beneficiary` drop `institution_id`;');
    this.addSql('alter table `beneficiary` drop `institution_name`;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `beneficiary` change `firstname` `counter_part_id` varchar(255) null;',
    );
    this.addSql(
      'alter table `beneficiary` change `lastname` `name` varchar(255) null;',
    );
    this.addSql(
      'alter table `beneficiary` change `currency` `state` varchar(255) null;',
    );
    this.addSql(
      'alter table `beneficiary` change `payment_type` `postcode` varchar(255) null;',
    );

    this.addSql(
      'alter table `beneficiary` add `date_of_birth` datetime null, add `customer_loan_base_balance` int(11) null, add `customer_credit_limit` int(11) null, add `customer_expected_installment_amount` int(11) null, add `reference` varchar(255) not null, add `institution_id` varchar(255) null, add `institution_name` varchar(255) not null;',
    );
  }
}
