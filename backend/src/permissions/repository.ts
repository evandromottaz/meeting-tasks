import Database from 'better-sqlite3';
import { Permission, PermissionError } from './model';
import { PERMISSION_MESSAGES } from '@/shared/const';

interface Row {
	id: number | bigint;
	task_id: number;
	volunteer_id: number;
}

export class PermissionRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ taskId, volunteerId }: Permission) {
		const { lastInsertRowid } = this.db
			.prepare('INSERT INTO permissions(task_id,volunteer_id) VALUES (?, ?)')
			.run(taskId, volunteerId);
		return { id: lastInsertRowid, taskId, volunteerId };
	}

	findByVolunteerAndRole({ taskId, volunteerId }: Permission) {
		return this.db
			.prepare('SELECT id FROM permissions WHERE task_id = ? AND volunteer_id = ?')
			.get(taskId, volunteerId);
	}

	listAll(): Permission[] {
		const rows = this.db.prepare('SELECT id, task_id, volunteer_id FROM permissions').all();
		return (rows as Row[]).map(({ task_id, volunteer_id, id }) => ({
			id,
			taskId: task_id,
			volunteerId: volunteer_id,
		}));
	}

	getById(id: Permission['id']): Permission | null {
		const row = this.db
			.prepare('SELECT id, task_id, volunteer_id FROM permissions WHERE id = ?')
			.get(id) as Row;

		if (!row) throw new PermissionError(404, PERMISSION_MESSAGES.NOT_FOUND);

		return {
			id: row.id,
			taskId: row.task_id,
			volunteerId: row.volunteer_id,
		};
	}

	update({ taskId, volunteerId, id }: Permission) {
		this.db
			.prepare('UPDATE permissions SET task_id = ?, volunteer_id = ? WHERE id = ?')
			.run(taskId, volunteerId, id);

		return { id, taskId, volunteerId };
	}

	remove(id: Permission['id']) {
		this.db.prepare('DELETE FROM permissions WHERE id = ?').run(id);
	}
}
