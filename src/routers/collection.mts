/// Collection router
import express from 'express';
import log4js from 'log4js';
import { authToken } from './authorize.mjs';
import { Collection } from '@/modules/database.mjs';
import { createCollection, deleteCollection, readAllCollections, updateCollection } from '@/modules/service.mjs';

// Router
const router: express.Router = express.Router();

// Create collection
router.post('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[POST]/api/collection');

  // Validate
  if (typeof req.body.name !== 'string') {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }

  // Call service
  createCollection(req.body.name)
    .then((value: Pick<Collection, 'id'>): void=>{
      logger.debug(`Created: id=${value.id}`);
      res.json(value);
    })
    .catch((err: Error): void=>{
      logger.error('Fail to create:', err);
      res.status(500).send('Database error');
    });
});

// Get collections
router.get('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[GET]/api/collection');

  // Call service
  readAllCollections()
    .then((value: Collection[]): void=>{
      logger.debug('Got');
      res.json(value);
    })
    .catch((err: Error): void=>{
      logger.error('Fail to get:', err);
      res.status(500).send('Database error');
    });
});

// Update collection
router.put('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[PUT]/api/collection');

  // Validate
  if (typeof req.body.id !== 'number' || !Number.isInteger(req.body.id)) {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }
  if (typeof req.body.name !== 'string') {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }

  // Call service
  updateCollection(req.body.id, req.body.name)
    .then((value: number): void=>{
      if (value === 0) {
        logger.warn(`Not updated: id=${req.body.id}, name=${req.body.name}`);
      } else {
        logger.debug(`Updated: id=${req.body.id}, name=${req.body.name}`);
      }
      res.sendStatus(204);
    })
    .catch((err: Error): void=>{
      logger.error('Fail to update:', err);
      res.status(500).send('Database error');
    });
});

// Delete collection
router.delete('/api/collection', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[DELETE]/api/collection');

  // Validate
  if (req.query.id === undefined) {
    logger.warn('Invalid request query:', req.query);
    res.sendStatus(400);
    return;
  }
  const id: number = parseInt(req.query.id.toString());
  if (isNaN(id) || !Number.isInteger(id)) {
    logger.warn('Invalid request query:', req.query);
    res.sendStatus(400);
    return;
  }

  // Call service
  deleteCollection(id)
    .then((value: number): void=>{
      if (value === 0) {
        logger.warn(`Not deleted: id=${id}`);
      } else {
        logger.debug(`Deleted: id=${id}`);
      }
      res.sendStatus(204);
    })
    .catch((err: Error): void=>{
      logger.error('Fail to update:', err);
      res.status(500).send('Database error');
    });
});

// Export default
export default router;
