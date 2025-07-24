import { Request, Response } from 'express';
import { db } from '@/database/db';
import { schema } from './schema';
import { MESSAGES } from './messages';
import {
	isDesignacaoExists,
	getDesignacaoById,
	isPapelExists,
	isUsuarioExists,
	hasPrivilegio,
} from './repository';

export async function create(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const { data, papelId, usuarioId } = result.data;

	if (!isUsuarioExists(usuarioId))
		return res.status(404).json({ message: MESSAGES.NOT_FOUND_USUARIO });

	if (!isPapelExists(papelId)) return res.status(404).json({ message: MESSAGES.NOT_FOUND_PAPEL });

	if (!hasPrivilegio({ usuarioId, papelId }))
		return res.status(403).json({ message: MESSAGES.NOT_ALLOWED_USUARIO });

	if (isDesignacaoExists({ data, usuarioId, papelId }))
		return res.status(409).json({ message: MESSAGES.ALREADY_REGISTERED });

	const { lastInsertRowid } = db
		.prepare('INSERT INTO designacoes (data_iso, papel_id, usuario_id) VALUES (?,?,?)')
		.run(data, papelId, usuarioId);
	res.status(201).json({ id: lastInsertRowid, data, papelId, usuarioId });
}

export async function getAll(req: Request, res: Response) {
	const rows = db.prepare('SELECT * FROM designacoes_info').all();
	res.status(200).json(rows);
}

export async function getById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const designacao = getDesignacaoById(id);
	if (!designacao) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json(designacao);
}

export async function update(req: Request, res: Response) {
	const result = schema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ message: result.error.issues[0].message });

	const id = Number(req.params.id);
	const { data, papelId, usuarioId } = result.data;

	if (!isUsuarioExists(usuarioId))
		return res.status(404).json({ message: MESSAGES.NOT_FOUND_USUARIO });

	if (!isPapelExists(papelId)) return res.status(404).json({ message: MESSAGES.NOT_FOUND_PAPEL });

	if (!hasPrivilegio({ usuarioId, papelId }))
		return res.status(403).json({ message: MESSAGES.NOT_ALLOWED_USUARIO });

	const row = db
		.prepare('UPDATE designacoes SET data_iso = ?, papel_id = ?, usuario_id = ? WHERE id = ?')
		.run(data, papelId, usuarioId, id);

	if (!row.changes) return res.status(404).json({ message: MESSAGES.NOT_FOUND });

	res.json({ message: MESSAGES.UPDATED_SUCCESS });
}

export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);
	const info = db.prepare('DELETE FROM designacoes WHERE id = ?').run(id);
	if (!info.changes) res.status(404).json({ error: MESSAGES.NOT_FOUND });

	res.json({ message: MESSAGES.DELETED_SUCCESS });
}
