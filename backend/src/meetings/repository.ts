import Database from 'better-sqlite3';
import { Meeting, MeetingError } from './model';
import { PERMISSION_MESSAGES } from '@/shared/const';

interface Row {
	id: number | bigint;
	date_iso: string;
	task_id: number;
	volunteer_id: number;
}

export class MeetingRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ date, taskId, volunteerId }: Meeting) {
		const row = this.db
			.prepare('INSERT INTO meetings(date_iso, task_id, volunteer_id) VALUES (?, ?, ?)')
			.run(date, taskId, volunteerId);

		return { id: row.lastInsertRowid, date, taskId, volunteerId };
	}

	listAll(): Meeting[] {
		const rows = this.db.prepare('SELECT id, date_iso, task_id, volunteer_id FROM meetings').all();
		return (rows as Row[]).map(({ date_iso, task_id, volunteer_id, id }) => ({
			id,
			date: date_iso,
			taskId: task_id,
			volunteerId: volunteer_id,
		}));
	}

	findByVolunteerAndRole({ taskId, volunteerId }: Meeting) {
		return this.db
			.prepare('SELECT id FROM permissions WHERE task_id = ? AND volunteer_id = ?')
			.get(taskId, volunteerId);
	}

	getById(id: Meeting['id']): Meeting {
		const row = this.db
			.prepare('SELECT id, task_id, volunteer_id FROM meetings WHERE id = ?')
			.get(id) as Row;

		if (!row) throw new MeetingError(404, PERMISSION_MESSAGES.NOT_FOUND);

		return {
			id: row.id,
			date: row.date_iso,
			taskId: row.task_id,
			volunteerId: row.volunteer_id,
		};
	}

	update({ taskId, volunteerId, id }: Meeting) {
		this.db
			.prepare('UPDATE meetings SET task_id = ?, volunteer_id = ? WHERE id = ?')
			.run(taskId, volunteerId, id);

		return { id, taskId, volunteerId };
	}

	remove(id: Meeting['id']) {
		this.db.prepare('DELETE FROM meetings WHERE id = ?').run(id);
	}
}
