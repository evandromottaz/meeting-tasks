import { Request, Response } from 'express';
import { schema } from './schema';
import { MESSAGES } from './messages';
import { createVolunteer, VolunteerRow } from './model';

export async function create(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const { name } = result.data;
	const { lastInsertRowid } = req.db
		.prepare('INSERT INTO volunteers (volunteer_name) VALUES (?)')
		.run(name);
	res.status(201).json({ id: lastInsertRowid, name });
}

export async function getAll(req: Request, res: Response) {
	const volunteers = req.db.prepare('SELECT id, volunteer_name FROM volunteers').all();
	res.status(200).json((volunteers as VolunteerRow[]).map(createVolunteer));
}

export async function getById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const row = req.db.prepare('SELECT volunteer_name FROM volunteers WHERE id = ?').get(id);
	if (!row) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json(createVolunteer(row as VolunteerRow));
}

export async function update(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: MESSAGES.INVALID_ID });

	const { name } = result.data;
	const row = req.db.prepare('UPDATE volunteers SET volunteer_name = ? WHERE id = ?').run(name, id);
	if (!row.changes) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ id, name });
}

export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id)) return res.status(400).json({ message: MESSAGES.INVALID_ID });

	const row = req.db.prepare('DELETE FROM volunteers WHERE id = ?').run(id);
	if (!row.changes) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ message: MESSAGES.DELETED });
}
