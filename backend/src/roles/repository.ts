import Database from 'better-sqlite3';
import { Role, RoleRow } from './model';

export class RoleRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ title }: Role) {
		const { lastInsertRowid } = this.db
			.prepare('INSERT INTO roles(role_title) VALUES (?)')
			.run(title);
		return { id: lastInsertRowid, title };
	}

	listAll(): Role[] {
		const rows = this.db.prepare('SELECT id, role_title FROM roles').all();
		return (rows as RoleRow[]).map(({ role_title, id }) => ({
			id,
			title: role_title,
		}));
	}

	getById(id: Role['id']): Role | null {
		const row = this.db.prepare('SELECT id, role_title FROM roles WHERE id = ?').get(id) as RoleRow;
		if (!row) return null;

		return {
			id: row.id,
			title: row.role_title,
		};
	}

	update({ title, id }: Role) {
		this.db.prepare('UPDATE roles SET role_title = ? WHERE id = ?').run(title, id);
		return { id, title };
	}

	remove(id: Role['id']) {
		this.db.prepare('DELETE FROM roles WHERE id = ?').run(id);
	}
}
