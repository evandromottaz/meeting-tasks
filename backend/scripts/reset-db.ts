import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(__dirname, '../src/database/db.sqlite');
const schemaPath = path.resolve(__dirname, '../src/database/schema.sql');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const schema = fs.readFileSync(schemaPath, 'utf-8');
const db = new Database(dbPath);
db.exec(schema);

console.log('Banco resetado.');
