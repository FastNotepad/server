/// Meta router
import express from 'express';
import { authToken } from './authorize.mjs';
import { db } from '@/modules/database.mjs';

// Router
const router: express.Router = express.Router();

// Get notes by collection
router.get('/api/meta/notes/:collectionId', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.params.collectionId === undefined) {
		res.sendStatus(400);
		return;
	}
	const collectionId: number = parseInt(req.params.collectionId);
	if (isNaN(collectionId) || !Number.isInteger(collectionId)) {
		res.sendStatus(400);
		return;
	}

	// Select
	db('notes')
		.select('note_id', 'title')
		.where('collection_id', collectionId === 0 ? null : collectionId)
		.then((v: any[]): void=>{
			res.json({
				status: 200,
				msg: 'Success',
				data: v
			});
		})
		.catch((err: Error): void=>{
			console.error(err);
			res.json({
				status: 500,
				msg: 'Database error'
			});
		});
});

// Get collections by collection
router.get('/api/meta/collections/:collectionId', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.params.collectionId === undefined) {
		res.sendStatus(400);
		return;
	}
	const collectionId: number = parseInt(req.params.collectionId);
	if (isNaN(collectionId) || !Number.isInteger(collectionId)) {
		res.sendStatus(400);
		return;
	}

	// Select
	db('collections')
		.select('collection_id', 'name')
		.where('parent_collection_id', collectionId === 0 ? null : collectionId)
		.then((v: any[]): void=>{
			res.json({
				status: 200,
				msg: 'Success',
				data: v
			});
		})
		.catch((err: Error): void=>{
			console.error(err);
			res.json({
				status: 500,
				msg: 'Database error'
			});
		});
});

// Export default
export default router;
