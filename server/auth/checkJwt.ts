import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { fetchPublicKey } from './fetchPublicKey';
import { db } from '../db';
import logger from '../util/logger';
import { DYNAMIC_PROJECT_ID } from '../constants';

const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  // console.log({authHeader})
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // console.log({token})
    try {
        let environmentId = DYNAMIC_PROJECT_ID;
        if (typeof environmentId !== 'string') {
          throw new Error('DYNAMIC_PROJECT_ID must be a string');
        }
        const aud = 'https://app.dynamicauth.com'

        const publicKey = await fetchPublicKey({ environmentId, aud });
        // console.log({publicKey})
        // console.log({toke: jwt.decode(token, { complete: true })})
        // const UNVERIFIED_TOKEN = jwt.decode(token, { complete: true }) as any;

        const valid = jwt.verify(token, publicKey, {
          ignoreExpiration: false,
        }) as JwtPayload; 

        const reqEmail = valid.email;
        
        let sql = `SELECT id FROM users WHERE email = ?`;

        const params = [reqEmail];

        db.query(sql, params, (err: any, results: any) => {
            if (err) {
              console.error(err);
              res.status(404).send('User not found');
            }

            if (results?.length > 0) {
              req.user = {
                id: JSON.stringify(results?.[0]?.id),
                email: reqEmail as string,
              };
            } else {
              // new user, temporarily assign '' as userid
              req.user = {
                id: '',
                email: reqEmail as string,
              };
            }
          
            next(); // Proceed to the next middleware/route handler
        })


    } catch (error) {
        // Token verification failed
        logger(JSON.stringify(error, null, 2), 'error');
        res.status(401).send('Unauthorized: Invalid token');
    }

  } else {
    // If the Authorization header is missing or doesn't have a Bearer token, return a 401 Unauthorized response
    res.status(401).send('Unauthorized');
  }
};

export default checkJwt;
