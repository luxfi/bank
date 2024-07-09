import { Migration } from '@mikro-orm/migrations';

export class Migration20240528111159 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await knex.transaction(async (trx) => {
      await trx.schema
        .alterTable('account', (table) => {
          table.uuid('gateway_id').nullable();
          table.uuid('gateway').nullable();
        })
        .transacting(trx);

      await trx.schema
        .alterTable('transaction', (table) => {
          table.uuid('gateway_id').nullable();
          table.uuid('cdax_beneficiary_id').nullable();
        })
        .transacting(trx);

      await trx.schema
        .alterTable('beneficiary', (table) => {
          table.uuid('gateway_id').nullable();
        })
        .transacting(trx);

      await trx('account')
        .whereNotNull('cloud_currency_id')
        .update({
          gateway_id: knex.raw('cloud_currency_id'),
          gateway: 'currencycloud',
        })
        .transacting(trx);

      await trx('transaction')
        .whereNotNull('beneficiary_id')
        .update({
          gateway_id: knex.raw('beneficiary_id'),
        })
        .transacting(trx);

      await trx('beneficiary')
        .whereNotNull('currency_cloud_id')
        .update({
          gateway_id: knex.raw('currency_cloud_id'),
        })
        .transacting(trx);

      const transactionBeneficiaryIds = await trx('transaction')
        .select('beneficiary_id')
        .distinct('beneficiary_id')
        .whereNotNull('beneficiary_id')
        .transacting(trx);

      const beneficiaries = await trx('beneficiary')
        .select('currency_cloud_id', 'uuid')
        .whereIn(
          'currency_cloud_id',
          transactionBeneficiaryIds.map((t) => t.beneficiary_id),
        )
        .transacting(trx);

      for (const data of beneficiaries) {
        await knex('transaction')
          .where('beneficiary_id', data.currency_cloud_id)
          .update({
            cdax_beneficiary_id: data.uuid,
            gateway: 'currencycloud',
          })
          .transacting(trx);
      }
    });
  }

  async down(): Promise<void> {
    // this.addSql('DROP TABLE `news_letter`');
  }
}
