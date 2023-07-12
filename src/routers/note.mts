/// Note router
import express from 'express';
import { authToken } from './authorize.mjs';
import { db } from '@/modules/database.mjs';

// Router
const router: express.Router = express.Router();

// Get note
router.get('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Validate
  if (req.query.id === undefined) {
    res.sendStatus(400);
    return;
  }
  const id: number = parseInt(req.query.id.toString());
  if (isNaN(id) || !Number.isInteger(id)) {
    res.sendStatus(400);
    return;
  }

  // Select
  db('notes')
    .select('title', 'modify_at', 'contents')
    .where('id', id)
    .then((v: any[]): void=>{
      if (v.length === 0) {
        res.json({
          status: 400,
          msg: 'Note not found'
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

// Create note
router.post('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Validate
  if (typeof req.body.title !== 'string' || typeof req.body.contents !== 'string') {
    res.sendStatus(400);
    return;
  }

  // Insert
  db('notes')
    .insert({
      title: req.body.title,
      contents: req.body.contents,
      modify_at: db.fn.now()
    })
    .returning('id')
    .then((v: { id: number }[]): void=>{
      res.json({
        status: 200,
        msg: 'Success',
        noteId: v[0].id
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
router.patch('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Validate
  if (typeof req.body.id !== 'number' || !Number.isInteger(req.body.id)) {
    res.sendStatus(400);
    return;
  }
  if (!['number', 'undefined'].includes(typeof req.body.collection) || (typeof req.body.collection === 'number' && !Number.isInteger(req.body.collection))) {
    res.sendStatus(400);
    return;
  }
  if (!['string', 'undefined'].includes(typeof req.body.title)) {
    res.sendStatus(400);
    return;
  }
  if (!['string', 'undefined'].includes(typeof req.body.contents)) {
    res.sendStatus(400);
    return;
  }

  // Update
  db('notes')
    .update({
      collection: req.body.collection,
      title: req.body.title,
      modify_at: db.fn.now(),
      contents: req.body.contents
    })
    .where('id', req.body.id)
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
  if (req.query.id === undefined) {
    res.sendStatus(400);
    return;
  }
  const id: number = parseInt(req.query.id.toString());
  if (isNaN(id) || !Number.isInteger(id)) {
    res.sendStatus(400);
    return;
  }

  // Delete
  db('notes')
    .delete()
    .where('id', id)
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
