import express from 'express';
import volunteersRoutes from '@/volunteers/routes';
import rolesRoutes from '@/roles/routes';
import designacoesRoutes from '@/designacoes/routes';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export function createApp(db: InstanceType<typeof Database>) {
  const app = express();
  app.use(express.json());

  app.use((req, _res, next) => {
    req.db = db;
    next();
  });

  app.use('/volunteers', volunteersRoutes);
  app.use('/roles', rolesRoutes);
  app.use('/designacoes', designacoesRoutes);

  return app;
}

if (require.main === module) {
  const schemaPath = path.resolve(__dirname, './database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const db = new Database(`${__dirname}/database/db.sqlite`);
  db.exec(schema);

  const app = createApp(db);
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
}

export type App = ReturnType<typeof createApp>;
