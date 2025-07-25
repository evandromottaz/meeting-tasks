import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { createApp } from '@/index';

export function setupTestApp() {
  const db = new Database(':memory:');
  const schema = fs.readFileSync(path.resolve(__dirname, './schema.test.sql'), 'utf-8');
  db.exec(schema);

  const app = createApp(db);
  return { app, db };
}