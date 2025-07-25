import { execSync } from 'child_process';
import path from 'path';

const sourceDb = path.resolve(__dirname, '../src/database/db.sqlite');
const outputSql = path.resolve(__dirname, '../tests/helpers/schema.test.sql');

execSync(`sqlite3 ${sourceDb} .schema > ${outputSql}`);
console.log('Schema exportado com sucesso.');