import Database from 'better-sqlite3';
import path from 'path'

const dbPath = path.resolve(__dirname, 'db.sqlite');
export const db = new Database(dbPath);
