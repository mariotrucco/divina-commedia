import { setupIndex } from './v0.0.1/1';
import { putData } from './v0.0.1/2';
import { Client } from '@elastic/elasticsearch';
import config from 'config';

const client = new Client({ node: config.get<string>('elasticsearch.node') });
const MIGRATIONS_INDEX = 'migrations';
type Migration = { migrationfunction: () => Promise<void>; version: number };
const MIGRATION_FUNCTIONS = [
  { migrationfunction: setupIndex, version: 1 },
  { migrationfunction: putData, version: 2 }
];

async function setupMigrationIndex(): Promise<void> {
  const existsResponse = await client.indices.exists({
    index: MIGRATIONS_INDEX
  });
  const exists = existsResponse.body;
  if (!exists) {
    await client.indices.create({
      index: MIGRATIONS_INDEX,
      body: {
        settings: {
          index: {
            number_of_replicas: config.get<string>(
              'elasticsearch.numberOfReplicas'
            )
          }
        }
      }
    });
    await client.indices.putMapping({
      index: MIGRATIONS_INDEX,
      body: {
        properties: {
          version: { type: 'integer' },
          ranAt: { type: 'date' }
        }
      }
    });
  }
}

async function getLastMigrationVersion(): Promise<number | undefined> {
  const result = await client.search({
    index: MIGRATIONS_INDEX,
    body: {
      sort: { version: { order: 'desc' } },
      size: 1
    }
  });
  const source = result.body.hits.hits[0]?._source;
  if (source) {
    console.log('Last Migration', source);
  }
  return source?.version;
}

async function saveMigrationVersion(version: number): Promise<void> {
  await client.index({
    index: MIGRATIONS_INDEX,
    body: {
      version,
      ranAt: new Date()
    }
  });
}

async function getMigrationsToRun(): Promise<Migration[]> {
  const result = MIGRATION_FUNCTIONS.slice(await getLastMigrationVersion());
  console.log(`${result.length} migrations to run`);
  return result;
}

async function runMigrations(): Promise<void> {
  const migrations = await getMigrationsToRun().catch((err) => {
    console.error('Could not get the list of migrations to run.', err);
    throw err;
  });
  // eslint-disable-next-line no-loops/no-loops
  for (const migration of migrations) {
    const version = migration.version;
    console.log(`Running migration version ${version}.`);
    await migration.migrationfunction().catch((err) => {
      console.error(
        `Could not run the migration function for migration version ${version}.`,
        err
      );
      throw err;
    });
    await saveMigrationVersion(version).catch((err) => {
      console.error(`Could not save the migration version ${version}.`, err);
      throw err;
    });
  }
}

async function migrate() {
  await setupMigrationIndex().catch((err) => {
    console.error('Could not set up the migrations index.', err);
    throw err;
  });
  await runMigrations().catch((err) => {
    console.error('Could not run the migrations.', err);
    throw err;
  });
  console.log('Ran migrations: Done.');
}

migrate().catch((err) => console.error('Could not migrate', err));
