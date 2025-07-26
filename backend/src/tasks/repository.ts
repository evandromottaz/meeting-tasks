import Database from 'better-sqlite3';
import { Task } from './model';

interface Row {
	id: number;
	task_title: string;
}

export class TaskRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ title }: Task) {
		const { lastInsertRowid } = this.db
			.prepare('INSERT INTO tasks(task_title) VALUES (?)')
			.run(title);
		return { id: lastInsertRowid, title };
	}

	listAll(): Task[] {
		const rows = this.db.prepare('SELECT id, task_title FROM tasks').all();
		return (rows as Row[]).map(({ task_title, id }) => ({
			id,
			title: task_title,
		}));
	}

	getById(id: Task['id']): Task | null {
		const row = this.db.prepare('SELECT id, task_title FROM tasks WHERE id = ?').get(id) as Row;
		if (!row) return null;

		return {
			id: row.id,
			title: row.task_title,
		};
	}

	update({ title, id }: Task) {
		this.db.prepare('UPDATE tasks SET task_title = ? WHERE id = ?').run(title, id);
		return { id, title };
	}

	remove(id: Task['id']) {
		this.db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
	}
}
