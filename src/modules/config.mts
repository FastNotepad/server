/// Config module
import assert from 'assert';
import dotenv from 'dotenv';
import log4js from 'log4js';

// Get config
dotenv.config();

// Check config
assert.notStrictEqual(process.env.PASSWORD, undefined, 'Password CANNOT be empty');
assert.notStrictEqual(process.env.DB_PATH, undefined, 'Database path CANNOT be empty');
assert.match(
  process.env.LOG_LEVEL ?? 'info',
  /^trace|debug|info|warn|error|fatal$/,
  'Log level MUST be one of "trace", "debug", "info", "warn", "error" or "fatal"'
);

// Set logger
log4js.configure({
  appenders: {
    out: {
      layout: { type: 'colored' },
      type: 'stdout'
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.LOG_LEVEL ?? 'info'
    }
  }
});
log4js.getLogger('config').info(`Log level: ${process.env.LOG_LEVEL ?? 'info'}`);
