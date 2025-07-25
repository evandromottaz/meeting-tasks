import Database from 'better-sqlite3';
import { Permission, PermissionRow } from './model';

export class PermissionRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ roleId, volunteerId }: Permission) {
		const { lastInsertRowid } = this.db
			.prepare('INSERT INTO permissions(role_id,volunteer_id) VALUES (?, ?)')
			.run(roleId, volunteerId);
		return { id: lastInsertRowid, roleId, volunteerId };
	}

	getVolunteer(volunteerId: Permission['volunteerId']) {
		return this.db.prepare('SELECT id FROM volunteers WHERE id = ?').get(volunteerId);
	}

	getRole(roleId: Permission['roleId']) {
		return this.db.prepare('SELECT id FROM roles WHERE id = ?').get(roleId);
	}

	findByVolunteerAndRole({ roleId, volunteerId }: Permission) {
		return this.db
			.prepare('SELECT id FROM permissions WHERE role_id = ? AND volunteer_id = ?')
			.get(roleId, volunteerId);
	}

	listAll(): Permission[] {
		const rows = this.db.prepare('SELECT id, role_id, volunteer_id FROM permissions').all();
		return (rows as PermissionRow[]).map(({ role_id, volunteer_id, id }) => ({
			id,
			roleId: role_id,
			volunteerId: volunteer_id,
		}));
	}

	getById(id: Permission['id']): Permission | null {
		const row = this.db
			.prepare('SELECT id, role_id, volunteer_id FROM permissions WHERE id = ?')
			.get(id) as PermissionRow;
		if (!row) return null;

		return {
			id: row.id,
			roleId: row.role_id,
			volunteerId: row.volunteer_id,
		};
	}

	update({ roleId, volunteerId, id }: Permission) {
		this.db
			.prepare('UPDATE permissions SET role_id = ?, volunteer_id = ? WHERE id = ?')
			.run(roleId, volunteerId, id);

		return { id, roleId, volunteerId };
	}

	remove(id: Permission['id']) {
		this.db.prepare('DELETE FROM permissions WHERE id = ?').run(id);
	}
}
