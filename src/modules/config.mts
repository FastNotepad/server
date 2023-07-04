/// Config module
import assert from 'assert';
import dotenv from 'dotenv';

// Get config
dotenv.config();

// Check config
assert.notStrictEqual(process.env.PASSWORD, undefined, 'Password CANNOT be empty');
assert.notStrictEqual(process.env.DB_PATH, undefined, 'Database path CANNOT be empty');
