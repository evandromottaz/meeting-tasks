import Database from 'better-sqlite3';
import { Meeting, SuccessReturning } from './model';
import { MEETING_MESSAGES } from '@/shared/const';
import { NotFoundError } from '@/shared/exceptions';

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
		const row = this.db.prepare('SELECT * FROM meetings WHERE id = ?').get(id) as Row;
		if (!row) throw new NotFoundError(MEETING_MESSAGES.NOT_FOUND);

		return {
			id: row.id,
			date: row.date_iso,
			taskId: row.task_id,
			volunteerId: row.volunteer_id,
		};
	}

	update({ taskId, volunteerId, id }: Omit<Meeting, 'date'>) {
		const queryMap = new Map([
			['task_id', taskId],
			['volunteer_id', volunteerId],
		]);

		if (!taskId) queryMap.delete('task_id');
		if (!volunteerId) queryMap.delete('volunteer_id');

		const query = [...queryMap.keys()].map((column) => `${column} = ?`).join(',');

		const row = this.db
			.prepare(`UPDATE meetings SET ${query} WHERE id = ?`)
			.run(...queryMap.values(), id);

		if (!row.changes) throw new NotFoundError(MEETING_MESSAGES.NOT_FOUND);
		const data = this.db.prepare('SELECT * FROM meetings WHERE id = ?').get(id) as Row;

		return { id, date: data.date_iso, taskId: data.task_id, volunteerId: data.volunteer_id };
	}

	remove(id: Meeting['id']) {
		const row = this.db.prepare('DELETE FROM meetings WHERE id = ?').run(id);
		if (!row.changes) throw new NotFoundError(MEETING_MESSAGES.NOT_FOUND);
	}
}
