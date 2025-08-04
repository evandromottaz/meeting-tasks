import express from 'express';
import volunteersRoutes from '@/shared/volunteers/routes';
import tasksRoutes from '@/shared/tasks/routes';
import permissionsRoutes from '@/shared/permissions/routes';
import meetingsRoutes from '@/app/meetings/routes';
import Database from 'better-sqlite3';
import path from 'path';

export function createApp(db: InstanceType<typeof Database>) {
	const app = express();
	app.use(express.json());

	app.use((req, _res, next) => {
		req.db = db;
		next();
	});

	app.use('/volunteers', volunteersRoutes);
	app.use('/tasks', tasksRoutes);
	app.use('/permissions', permissionsRoutes);
	app.use('/meetings', meetingsRoutes);

	return app;
}

const dbPath = path.resolve(__dirname, '../database/db.sqlite');

if (require.main === module) {
	const db = new Database(dbPath);

	const app = createApp(db);
	app.listen(3000, () => {
		console.log('Servidor rodando na porta 3000');
	});
}

export type App = ReturnType<typeof createApp>;
