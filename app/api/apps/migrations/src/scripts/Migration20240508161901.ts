import { Migration } from '@mikro-orm/migrations';
import { generateShortUniqId } from '@tools/misc/utils/ShortUniqId';

export class Migration20240508120000 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await knex.transaction(async (trx) => {
      const transactions = await trx('transaction')
        .whereNull('cdax_id')
        .transacting(trx);

      for (const transaction of transactions) {
        const code = generateShortUniqId(8);
        await trx('transaction')
          .where('uuid', transaction.uuid)
          .update({
            cdax_id: code,
          })
          .transacting(trx);
      }
    });
  }
}
