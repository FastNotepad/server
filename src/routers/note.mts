/// Note router
import express from 'express';
import { authToken } from './authorize.mjs';
import { db } from '@/modules/database.mjs';

// Router
const router: express.Router = express.Router();

// Create note
router.post('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.body.title === undefined || req.body.contents === undefined) {
		res.sendStatus(400);
		return;
	}

	// Insert
	db('notes')
		.insert({
			title: req.body.title,
			contents: req.body.title,
			modify_timestamp: db.fn.now()
		})
		.returning('note_id')
		.then((v: { note_id: number }[]): void=>{
			res.json({
				status: 200,
				msg: 'Success',
				noteId: v[0].note_id
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

// Update note
router.put('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.body.noteId === undefined || (req.body.title === undefined && req.body.contents === undefined && req.body.collectionId)) {
		res.sendStatus(400);
		return;
	}
	const noteId: number = parseInt(req.body.noteId);
	if (isNaN(noteId) || !Number.isInteger(noteId)) {
		res.sendStatus(400);
		return;
	}
	const collectionId: number | undefined = req.body.collectionId === undefined ? undefined : parseInt(req.body.collectionId);
	if (collectionId !== undefined && (isNaN(collectionId) || !Number.isInteger(collectionId))) {
		res.sendStatus(400);
		return;
	}

	// Update
	db('notes')
		.update({
			collection_id: collectionId == undefined ? undefined : (collectionId === 0 ? null : collectionId),
			title: req.body.title,
			contents: req.body.contents,
			modify_timestamp: db.fn.now()
		})
		.where('note_id', noteId)
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

// Delete note
router.delete('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
	// Validate
	if (req.body.noteId === undefined) {
		res.sendStatus(400);
		return;
	}
	const noteId: number = parseInt(req.body.noteId);
	if (isNaN(noteId) || !Number.isInteger(noteId)) {
		res.sendStatus(400);
		return;
	}

	// Delete
	db('notes')
		.delete()
		.where('note_id', noteId)
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
