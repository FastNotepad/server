/// Authorize router
import crypto from 'crypto';
import express from 'express';
import log4js from 'log4js';
import jwt from 'jsonwebtoken';

// Logger
const logger: log4js.Logger = log4js.getLogger('authorize');

// JWT secret
const jwtSecret: string = process.env.JWT_SECRET ?? crypto.randomBytes(64).toString('hex');
logger.debug(`JWT secret: ${jwtSecret}`);

// Authorize token
export function authToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
  // Check header
  const authHeader: string | undefined = req.headers['authorization'];
  if (authHeader === undefined) {
    logger.debug('Header not found');
    res.sendStatus(401);
    return;
  }

  // Check bearer token
  const result: RegExpExecArray | null = /^Bearer (.*)$/.exec(authHeader);
  if (result === null) {
    logger.debug('Invalid header:', authHeader);
    res.sendStatus(401);
    return;
  }

  // Verify
  jwt.verify(result[1], jwtSecret, (err: jwt.VerifyErrors | null): void=>{
    // Token expires or invalid
    if (err !== null) {
      logger.warn('Expired or invalid token');
      res.sendStatus(401);
      return;
    }

    // Passed
    next();
  });
}

// Router
const router: express.Router = express.Router();

// Authorize
router.post('/api/authorize', (req: express.Request, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[POST]/api/authorize');

  // Validate
  if (typeof req.body.password !== 'string') {
    logger.debug('Invalid request body:', req.body);
    res.sendStatus(400);
    return;
  }

  // Check password
  if (req.body.password !== process.env.PASSWORD) {
    logger.warn(`Wrong password: password="${req.body.password}"`);
    res.json({
      status: 400,
      msg: 'Wrong password'
    });
    return;
  }

  // Sign
  const token: string = jwt.sign({ timestamp: new Date().getTime() }, jwtSecret, { algorithm: 'HS512', expiresIn: '1d' });
  logger.info('JWT signed');

  // Send token
  res.json({
    status: 200,
    msg: 'Success',
    token
  });
});

// Refresh authorize
router.put('/api/authorize', authToken, (_, res: express.Response): void=>{
  // Logger
  const logger: log4js.Logger = log4js.getLogger('[PUT]/api/authorize');

  // Sign
  const token: string = jwt.sign({ timestamp: new Date().getTime() }, jwtSecret, { algorithm: 'HS512', expiresIn: '1d' });
  logger.info('JWT resigned');

  // Send token
  res.json({ token });
});

// Export default
export default router;
