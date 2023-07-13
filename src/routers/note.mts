/// Note router
import express from 'express';
import log4js from 'log4js';
import { authToken } from './authorize.mjs';
import { Note } from '@/modules/database.mjs';
import { createNote, deleteNote, readAllNotesByCollection, readAllNotesByTitle, readNoteById, updateNote } from '@/modules/service.mjs';

// Router
const router: express.Router = express.Router();

// Create note
router.post('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[POST]/api/note');

  // Validate
  if (typeof req.body.title !== 'string' || typeof req.body.contents !== 'string') {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }

  // Call service
  createNote(req.body.title, req.body.contents)
    .then((value: Pick<Note, 'id'>): void=>{
      logger.debug(`Created: id=${value.id}`);
      res.json(value);
    })
    .catch((err: Error): void=>{
      logger.error('Fail to create:', err);
      res.status(500).send('Database error');
    });
});

// Get note
router.get('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[GET]/api/note');

  // Validate
  const id: number | undefined = req.query.id === undefined ? undefined : parseInt(req.query.id.toString());
  if (id !== undefined && (isNaN(id) || !Number.isInteger(id))) {
    logger.warn('Invalid request query:', req.query);
    res.sendStatus(400);
    return;
  }
  const collection: number | undefined = req.query.collection === undefined ? undefined : parseInt(req.query.collection.toLocaleString());
  if (collection !== undefined && (isNaN(collection) || !Number.isInteger(collection))) {
    logger.warn('Invalid request query:', req.query);
    res.sendStatus(400);
    return;
  }
  const title: string | undefined = req.query.title === undefined ? undefined : req.query.title.toString();
  if (id ?? collection ?? title === undefined) {
    logger.warn('Invalid request query:', req.query);
    res.sendStatus(400);
    return;
  }

  // Call services
  if (id !== undefined) {
    readNoteById(id)
      .then((value: Note | null): void=>{
        if (value === null) {
          res.sendStatus(404);
        } else {
          res.json(value);
        }
      })
      .catch((err: Error): void=>{
        logger.error('Fail to update:', err);
        res.status(500).send('Database error');
      });
  } else {
    (collection !== undefined ? readAllNotesByCollection(collection === 0 ? null : collection) : readAllNotesByTitle(title))
      .then((value: Pick<Note, 'id' | 'title'>[]): void=>{
        res.json(value);
      })
      .catch((err: Error): void=>{
        logger.error('Fail to update:', err);
        res.status(500).send('Database error');
      });
  }
});

// Update note
router.patch('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[PATCH]/api/note');

  // Validate
  if (typeof req.body.id !== 'number' || !Number.isInteger(req.body.id)) {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }
  if (!['number', 'undefined'].includes(typeof req.body.collection) || (typeof req.body.collection === 'number' && !Number.isInteger(req.body.collection))) {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }
  if (!['string', 'undefined'].includes(typeof req.body.title)) {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }
  if (!['string', 'undefined'].includes(typeof req.body.contents)) {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }
  if (req.body.collection ?? req.body.title ?? req.body.constents === undefined) {
    logger.warn('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }

  // Call service
  updateNote(req.body.id, {
    collection: req.body.collection,
    title: req.body.title,
    contents: req.body.contents
  }).then((value: number): void=>{
    if (value === 0) {
      logger.warn('Not updated:', req.body);
    } else {
      logger.debug('Updated:', req.body);
    }
    res.sendStatus(204);
  }).catch((err: Error): void=>{
    logger.error('Fail to update:', err);
    res.status(500).send('Database error');
  });
});

// Delete note
router.delete('/api/note', authToken, (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[DELETE]/api/note');

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
  deleteNote(id)
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
