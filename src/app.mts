/// Main entrance
import express from 'express';

// Config
import './modules/config.mjs';

// Routers
import authorizeRouter from './routers/authorize.mjs';
import collectionRouter from './routers/collection.mjs';
import noteRouter from './routers/note.mjs';

// Check argument
import { setup } from './modules/database.mjs';
if (process.argv[2] === 'setup') {
	console.log('Setup database');
	await setup();
	console.log('Done');
	process.exit(0);
}

// Application instance
const app: express.Application = express();

// Use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routers
app.use(authorizeRouter);
app.use(collectionRouter);
app.use(noteRouter);

// Start server
app.listen(process.env.PORT ?? 3000, (): void=>{
	console.log(`Server listening on port ${process.env.PORT ?? 3000}`);
});
