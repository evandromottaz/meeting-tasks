import { Request, Response } from 'express';
import { db } from '@/database/db';
import { schema } from './schema';
import { MESSAGES } from './messages';

export async function create(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const titulo = result.data.titulo.trim();
	const { lastInsertRowid } = db.prepare('INSERT INTO papeis (titulo) VALUES (?)').run(titulo);
	res.status(201).json({ id: lastInsertRowid, titulo });
}

export async function getAll(req: Request, res: Response) {
	const papeis = db.prepare('SELECT id, titulo FROM papeis ORDER BY id').all();
	res.status(200).json(papeis);
}

export async function getById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const papel = db.prepare('SELECT titulo FROM papeis WHERE id = ?').get(id);
	if (!papel) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json(papel);
}

export async function update(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const { id } = req.params;
	const titulo = result.data.titulo.trim();
	const info = db.prepare('UPDATE papeis SET titulo = ? WHERE id = ?').run(titulo, id);
	if (!info.changes) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ id, titulo });
}

export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);
	const info = db.prepare('DELETE FROM papeis WHERE id = ?').run(id);
	if (!info.changes) res.status(404).json({ error: MESSAGES.NOT_FOUND });

	res.json({ message: `Usuário deletado com sucesso.` });
}
