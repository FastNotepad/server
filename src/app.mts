/// Main entrance
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import log4js from 'log4js';
import path from 'path';
import url from 'url';

// Config
import './modules/config.mjs';
import { setup } from './modules/database.mjs';

// Routers
import authorizeRouter from './routers/authorize.mjs';
import collectionRouter from './routers/collection.mjs';
import noteRouter from './routers/note.mjs';

// Logger
const logger: log4js.Logger = log4js.getLogger('app');

// Check argument
if (process.argv[2] === 'setup') {
  await setup();
  process.exit(0);
}

// Get __dirname
const __filenameNew: string = url.fileURLToPath(import.meta.url);
const __dirnameNew: string = path.dirname(__filenameNew);

// Application instance
const app: express.Application = express();

// Use middlewares
app.use(express.static(__dirnameNew + '/www'));
app.use(express.json());
app.use(compression());
app.use(helmet());

// Use routers
app.use(authorizeRouter);
app.use(collectionRouter);
app.use(noteRouter);



// Start server
app.listen(process.env.PORT ?? 3000, (): void=>{
  logger.info(`Server listening on port ${process.env.PORT ?? 3000}`);
});
