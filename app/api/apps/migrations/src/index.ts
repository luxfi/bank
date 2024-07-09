import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../mikro-orm.config';
import { basename } from 'path';

async function runMigrations() {
  const migrations = {};

  function importAll(r) {
    r.keys().forEach(
      (key) => (migrations[basename(key)] = Object.values(r(key))[0]),
    );
  }

  importAll((require as any).context('./scripts', false, /\.ts$/));
  console.log('Migrations:', migrations);

  const migrationsList = Object.keys(migrations).map((migrationName) => ({
    name: migrationName,
    class: migrations[migrationName],
  }));

  const orm = await MikroORM.init({
    ...mikroOrmConfig,
    migrations: { ...mikroOrmConfig.migrations, migrationsList },
  });
  const migrator = orm.getMigrator();

  try {
    console.log('Running migrations...');
    const migrations = await migrator.up(); // Executa todas as migrações pendentes
    console.log('Migrations executed:', migrations);
  } catch (error) {
    console.error('Error during migrations:', error);
  } finally {
    await orm.close(true);
  }
}

runMigrations();
