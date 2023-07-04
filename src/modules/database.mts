/// Database module
import knex from 'knex';

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
				tb.increments('collection_id');
				tb.integer('parent_collection_id');
				tb.string('name').notNullable();

				tb.foreign('parent_collection_id').references('collections.collection_id');
			}),
			trx.schema.createTable('notes', (tb: knex.Knex.CreateTableBuilder): void=>{
				tb.increments('note_id');
				tb.integer('collection_id').index();
				tb.string('title').notNullable();
				tb.timestamp('modify_at', { precision: 0, useTz: false }).notNullable();
				tb.text('contents').notNullable();

				tb.foreign('collection_id').references('collections.collection_id');
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
