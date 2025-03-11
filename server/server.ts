import express from "express";
require('dotenv').config();
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
const { default: fetch, Headers, Request, Response } = require('node-fetch');
import cors from "cors";


// @ts-ignore
import router from './routes';
import { BACKEND_URL, CLIENT_URL } from "./constants";
import logger from "./util/logger";
const app = express();

// Polyfill fetch, Headers, Request, and Response if they are not already defined
// AWS does not have these globals defined, so we need to polyfill them
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}
const setSecurityHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none';");
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // Set Strict-Transport-Security header only for backend.dev.rocko.cloud prod domain
  if (req.hostname === 'backend.dev.rocko.cloud') {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};

app.use(cors({
  // @ts-ignore
  origin: (origin: string, callback: any ) => {
    if (!origin || CLIENT_URL || /(^https:\/\/)(([a-z0-9]+[.])*testnet.)?rocko.co$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Apply the security headers middleware to all routes
app.use(setSecurityHeaders);

/////////////// Define Routes
app.use('/', router);

app.listen(5000, () => {
  logger(`Server started on ${BACKEND_URL}, with Client ${CLIENT_URL}`, 'info');
});
