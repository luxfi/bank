import { Migration } from '@mikro-orm/migrations';

export class Migration20240108162104 extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    await knex.transaction(async (trx) => {
      await trx.raw(
        "UPDATE user SET role='user:member' WHERE role='user:viewer';",
      );
    });
  }

  async down(): Promise<void> {}
}
