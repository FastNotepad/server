/// Collection router
import express from 'express';
import { authToken } from './authorize.mjs';
import { db } from '@/modules/database.mjs';

// Router
const router: express.Router = express.Router();

// Get collection
router.get('/api/collection/:collectionId', authToken, (req: express.Request, res: express.Response): void=>{
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
		.select('parent_collection_id', 'name')
		.where('collection_id', collectionId)
		.then((v: any[]): void=>{
			if (v.length === 0) {
				res.json({
					status: 400,
					msg: 'Collection not found'
				});
			} else {
				res.json({
					status: 200,
					msg: 'Success',
					data: v[0]
				});
			}
		})
		.catch((err: Error): void=>{
			console.error(err);
			res.json({
				status: 500,
				msg: 'Database error'
			});
		});
});

// Create collection
router.post('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.body.name === undefined) {
		res.sendStatus(400);
		return;
	}

	// Insert
	db('collections')
		.insert({ name: req.body.name })
		.returning('collection_id')
		.then((v: { collection_id: number }[]): void=>{
			res.json({
				status: 200,
				msg: 'Success',
				collectionId: v[0].collection_id
			})
		})
		.catch((err: Error): void=>{
			console.error(err);
			res.json({
				status: 500,
				msg: 'Database error'
			});
		});
});

// Update collection
router.put('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.body.collectionId === undefined || (req.body.name === undefined && req.body.parentId === undefined)) {
		res.sendStatus(400);
		return;
	}
	const collectionId: number = parseInt(req.body.collectionId);
	if (isNaN(collectionId) || !Number.isInteger(collectionId)) {
		res.sendStatus(400);
		return;
	}
	const parentId: number | undefined = req.body.parentId === undefined ? undefined : parseInt(req.body.parentId);
	if (parentId !== undefined && (isNaN(parentId) || !Number.isInteger(parentId))) {
		res.sendStatus(400);
		return;
	}

	// Update
	db('collections')
		.update({
			name: req.body.name,
			parent_collection_id: parentId === 0 ? null : parentId
		})
		.where('collection_id', collectionId)
		.then((): void=>{
			res.json({
				status: 200,
				msg: 'Success'
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

// Delete collection
router.delete('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.body.collectionId === undefined) {
		res.sendStatus(400);
		return;
	}
	const collectionId: number = parseInt(req.body.collectionId);
	if (isNaN(collectionId) || !Number.isInteger(collectionId)) {
		res.sendStatus(400);
		return;
	}

	// Delete
	db('collections')
		.delete()
		.where('collection_id', collectionId)
		.then((): void=>{
			res.json({
				status: 200,
				msg: 'Success'
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
