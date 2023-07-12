/// Authorize router
import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';

// JWT secret
const jwtSecret: string = process.env.JWT_SECRET ?? crypto.randomBytes(64).toString('hex');

// Authorize token
export function authToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
  // Check header
  const authHeader: string | undefined = req.headers['authorization'];
  if (authHeader === undefined) {
    res.sendStatus(401);
    return;
  }

  // Check bearer token
  const token: string[] = authHeader.split(' ');
  if (token.length !== 2 || token[0] !== 'Bearer') {
    res.sendStatus(401);
    return;
  }

  // Verify
  jwt.verify(token[1], jwtSecret, (err: jwt.VerifyErrors | null): void=>{
    // Token expires or invalid
    if (err !== null) {
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
  // Validate
  if (typeof req.body.password !== 'string') {
    res.sendStatus(400);
    return;
  }

  // Check password
  if (req.body.password !== process.env.PASSWORD) {
    res.json({
      status: 400,
      msg: 'Wrong password'
    });
    return;
  }

  // Sign
  const token: string = jwt.sign({ timestamp: new Date().getTime() }, jwtSecret, { algorithm: 'HS256', expiresIn: '1d' });

  // Send token
  res.json({
    status: 200,
    msg: 'Success',
    token
  });
});

// Refresh authorize
router.put('/api/authorize', authToken, (req: express.Request, res: express.Response): void=>{
  // Sign
  const token: string = jwt.sign({ timestamp: new Date().getTime() }, jwtSecret, { algorithm: 'HS256', expiresIn: '1d' });

  // Send token
  res.json({
    status: 200,
    msg: 'Success',
    token
  });
});

// Export default
export default router;
