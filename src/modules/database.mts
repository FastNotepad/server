/// Database module
import knex from 'knex';
import log4js from 'log4js';

/* [Database Structure Design]
 *
 * +------------------------------------------------+
 * | collections                                    |
 * +========+=========+=============================+
 * |  Name  |   Type  |          Constrains         |
 * +--------+---------+-----------------------------+
 * | id     | integer | Primary key, auto increment |
 * +--------+---------+-----------------------------+
 * | name   | string  | Not nullable                |
 * +--------+---------+-----------------------------+
 *
 * +--------------------------------------------------------------+
 * | notes                                                        |
 * +============+==========+======================================+
 * |    Name    |   Type   |               Contrains              |
 * +------------+----------+--------------------------------------+
 * | id         | integer  | Primary key, auto increment          |
 * +------------+----------+--------------------------------------+
 * | collection | integer  | Foreign from collections.id, indexed |
 * +------------+----------+--------------------------------------+
 * | title      | string   | Not nullable                         |
 * +------------+----------+--------------------------------------+
 * | modify_at  | datetime | Not nullable                         |
 * +------------+----------+--------------------------------------+
 * | contents   | text     | Not nullable                         |
 * +------------+----------+--------------------------------------+
 */

// Interfaces
export interface Collection {
  id: number;
  name: string;
}
export interface Note {
  id: number;
  collection: number | null;
  title: string;
  modify_at: string;
  contents: string;
}

// Logger
const logger: log4js.Logger = log4js.getLogger('database');

// Database instance
export const db: knex.Knex = await new Promise<knex.Knex>((res: (value: knex.Knex)=>void, rej: (reason?: any)=>void): void=>{
  // Create instance
  const tmp: knex.Knex = knex.default({
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH as string
    },
    useNullAsDefault: true
  });

  // Check connection
  tmp.raw('PRAGMA foreign_keys = ON')
    .then((): void=>{
      res(tmp);
    })
    .catch((err: Error): void=>{
      logger.error(err);
      rej(err);
    });
});

// Database setup
export async function setup(): Promise<void> {
  logger.info('Setup now');

  // Start transaction
  await db.transaction(async (trx: knex.Knex.Transaction): Promise<void>=>{
    // Drop old tables
    await trx.schema.dropTableIfExists('notes');
    await trx.schema.dropTableIfExists('collections');

    // Create tables
    await Promise.all([
      trx.schema.createTable('collections', (tb: knex.Knex.CreateTableBuilder): void=>{
        tb.increments('id');
        tb.string('name').notNullable();
      }),
      trx.schema.createTable('notes', (tb: knex.Knex.CreateTableBuilder): void=>{
        tb.increments('id');
        tb.integer('collection').index();
        tb.string('title').notNullable();
        tb.timestamp('modify_at', { precision: 0, useTz: false }).notNullable();
        tb.text('contents').notNullable();

        tb.foreign('collection').references('collections.id');
      })
    ]);

    // Insert example
    await trx('notes').insert({
      title: 'Welcome',
      contents: '# Welcome\n\nWelcome to use fastnote',
      modify_at: trx.fn.now()
    });
  });

  logger.info('Setup done');
}
