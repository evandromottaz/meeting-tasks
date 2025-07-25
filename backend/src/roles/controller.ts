import { Request, Response } from 'express';
import { schema } from './schema';
import { MESSAGES } from './messages';
import { createRole, RoleRow } from './model';

export async function create(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const { title } = result.data;
	const { lastInsertRowid } = req.db.prepare('INSERT INTO roles (role_title) VALUES (?)').run(title);
	res.status(201).json({ id: lastInsertRowid, title });
}

export async function getAll(req: Request, res: Response) {
	const roles = req.db.prepare('SELECT id, role_title FROM roles ORDER BY id').all();
	res.status(200).json((roles as RoleRow[]).map(createRole));
}

export async function getById(req: Request, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: MESSAGES.INVALID_ID });

	const role = req.db.prepare('SELECT role_title FROM roles WHERE id = ?').get(id);
	if (!role) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json(createRole(role as RoleRow));
}

export async function update(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: MESSAGES.INVALID_ID });

	const { title } = result.data;
	const row = req.db.prepare('UPDATE roles SET role_title = ? WHERE id = ?').run(title, id);
	if (!row.changes) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ id, title });
}

export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: MESSAGES.INVALID_ID });

	const row = req.db.prepare('DELETE FROM roles WHERE id = ?').run(id);
	if (!row.changes) res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ message: MESSAGES.DELETED });
}
