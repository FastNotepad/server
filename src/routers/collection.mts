/// Collection router
import express from 'express';
import { authToken } from './authorize.mjs';
import { db } from '@/modules/database.mjs';

// Router
const router: express.Router = express.Router();

// Get collection
router.get('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
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
  db('collections')
    .select('name', 'locked')
    .where('id', id)
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
  if (typeof req.body.name !== 'string') {
    res.sendStatus(400);
    return;
  }

  // Insert
  db('collections')
    .insert({ name: req.body.name })
    .returning('id')
    .then((v: { id: number }[]): void=>{
      res.json({
        status: 200,
        msg: 'Success',
        id: v[0].id
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
router.patch('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
  // Validate
  if (typeof req.body.id !== 'number' || !Number.isInteger(req.body.id)) {
    res.sendStatus(400);
    return;
  }
  if (!['string', 'undefined'].includes(typeof req.body.name)) {
    res.sendStatus(400);
    return;
  }
  if (!['boolean', 'undefined'].includes(typeof req.body.locked)) {
    res.sendStatus(400);
    return;
  }

  // Update
  db('collections')
    .update({
      name: req.body.name,
      locked: req.body.locked
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

// Delete collection
router.delete('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
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
  db('collections')
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
