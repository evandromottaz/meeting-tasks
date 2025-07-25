import Database from 'better-sqlite3';
import { Volunteer } from './model';

interface Row {
	id: number;
	volunteer_name: string;
}

export class VolunteerRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ name }: Volunteer) {
		const { lastInsertRowid } = this.db
			.prepare('INSERT INTO volunteers(volunteer_name) VALUES (?)')
			.run(name);
		return { id: lastInsertRowid, name };
	}

	listAll(): Volunteer[] {
		const rows = this.db.prepare('SELECT id, volunteer_name FROM volunteers').all();
		return (rows as Row[]).map(({ volunteer_name, id }) => ({
			id,
			name: volunteer_name,
		}));
	}

	getById(id: Volunteer['id']): Volunteer | null {
		const row = this.db
			.prepare('SELECT id, volunteer_name FROM volunteers WHERE id = ?')
			.get(id) as Row;
		if (!row) return null;

		return {
			id: row.id,
			name: row.volunteer_name,
		};
	}

	update({ name, id }: Volunteer) {
		this.db.prepare('UPDATE volunteers SET volunteer_name = ? WHERE id = ?').run(name, id);
		return { id, name };
	}

	remove(id: Volunteer['id']) {
		this.db.prepare('DELETE FROM volunteers WHERE id = ?').run(id);
	}
}
