import { Request, Response } from 'express';
import { schema } from './schema';
import { MESSAGES } from './messages';

export async function create(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const nome = result.data.nome.trim();
	const { lastInsertRowid } = req.db.prepare('INSERT INTO usuarios (nome) VALUES (?)').run(nome);
	res.status(201).json({ id: lastInsertRowid, nome });
}

export async function getAll(req: Request, res: Response) {
	const usuarios = req.db.prepare('SELECT id, nome FROM usuarios').all();
	res.status(200).json(usuarios);
}

export async function getById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuario = req.db.prepare('SELECT nome FROM usuarios WHERE id = ?').get(id);
	if (!usuario) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json(usuario);
}

export async function update(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const { id } = req.params;
	const nome = result.data.nome.trim();
	const info = req.db.prepare('UPDATE usuarios SET nome = ? WHERE id = ?').run(nome, id);
	if (!info.changes) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ id, nome });
}

export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);
	const info = req.db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
	if (!info.changes) res.status(404).json({ error: MESSAGES.NOT_FOUND });

	res.json({ message: `Usuário deletado com sucesso.` });
}
