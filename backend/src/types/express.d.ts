import { Database } from 'better-sqlite3';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    db: Database;
  }
}
