/// Database module
import knex from 'knex';

/* [Database Structure Design]
 *
 * +------------------------------------------------+
 * | collections                                    |
 * +========+=========+=============================+
 * |  Name  |   Type  |          Constrains         |
 * +--------+---------+-----------------------------+
 * | id     | integer | Primary key, auto increment |
 * +--------+---------+-----------------------------+
 * | name   | string  | Not nullable, indexed       |
 * +--------+---------+-----------------------------+
 * | locked | boolean | Not nullable                |
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
 * | title      | string   | Not nullable, indexed                |
 * +------------+----------+--------------------------------------+
 * | modify_at  | datetime | Not nullable                         |
 * +------------+----------+--------------------------------------+
 * | contents   | text     | Not nullable                         |
 * +------------+----------+--------------------------------------+
 */

// Database instance
export const db: knex.Knex = await new Promise<knex.Knex>((res, rej): void=>{
  const tmp: knex.Knex = knex.default({
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH as string
    },
    useNullAsDefault: true
  });

  tmp.raw('PRAGMA foreign_keys = ON')
    .then((): void=>{
      res(tmp);
    })
    .catch((err: Error): void=>{
      console.error(err);
      rej(err);
    });
});

// Database setup
export async function setup(): Promise<void> {
  // Start transaction
  await db.transaction(async (trx: knex.Knex.Transaction): Promise<void>=>{
    // Drop old tables
    await Promise.all([
      trx.schema.dropTableIfExists('collections'),
      trx.schema.dropTableIfExists('notes')
    ]);

    // Create independent table
    await Promise.all([
      trx.schema.createTable('collections', (tb: knex.Knex.CreateTableBuilder): void=>{
        tb.increments('id');
        tb.string('name').notNullable().index();
        tb.boolean('locked').notNullable();
      }),
      trx.schema.createTable('notes', (tb: knex.Knex.CreateTableBuilder): void=>{
        tb.increments('id');
        tb.integer('collection').index();
        tb.string('title').notNullable().index();
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
}
