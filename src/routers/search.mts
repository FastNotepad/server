/// Meta router
import express from 'express';
import { authToken } from './authorize.mjs';
import { db } from '@/modules/database.mjs';

// Router
const router: express.Router = express.Router();

// Search notes by collection or partial title
router.get('/api/search/notes', authToken, (req: express.Request, res: express.Response): void=>{
  // Validate
  if (req.query.c === undefined && req.query.t === undefined) {
    res.sendStatus(400);
    return;
  }
  const collection: number | undefined = req.query.c === undefined ? undefined : parseInt(req.query.c.toString());
  if (collection !== undefined && (isNaN(collection) || !Number.isInteger(collection))) {
    res.sendStatus(400);
    return;
  }

  // Select
  db('notes')
    .select('id', 'title')
    .orWhere('collection', collection ?? -1)
    .orWhereILike('title', `%${(req.query.t ?? '').toString()}%`)
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

// Search collections by partial name
router.get('/api/search/collections', authToken, (req: express.Request, res: express.Response): void=>{
  // Validate
  if (req.query.s === undefined) {
    res.sendStatus(400);
    return;
  }

  // Select
  db('collections')
    .select('id', 'name', 'locked')
    .whereILike('name', `%${req.query.s.toString()}%`)
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
