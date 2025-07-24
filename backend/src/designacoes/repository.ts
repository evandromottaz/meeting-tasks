import { db } from '../database/db';
import { Designacao, DesignacaoParams } from './types';

export function isUsuarioExists(id: number): boolean {
	const usuario = db.prepare('SELECT 1 FROM usuarios WHERE id = ?').get(id);
	return !!usuario;
}

export function isPapelExists(id: number): boolean {
	const papel = db.prepare('SELECT 1 FROM papeis WHERE id = ?').get(id);
	return !!papel;
}

export function hasPrivilegio({
	usuarioId,
	papelId,
}: Pick<DesignacaoParams, 'usuarioId' | 'papelId'>): boolean {
	const isTrue = db
		.prepare('SELECT 1 FROM privilegios WHERE usuario_id = ? AND papel_id = ?')
		.get(usuarioId, papelId);
	return !!isTrue;
}

export function isDesignacaoExists({ papelId, data, usuarioId }: DesignacaoParams): boolean {
	const row = db
		.prepare(
			`SELECT 1 FROM designacoes 
			WHERE data_iso = ? AND papel_id = ? AND usuario_id = ?`
		)
		.get(data, papelId, usuarioId) as Designacao;

	return !!row;
}

export function getDesignacaoById(id: Designacao['id']): Designacao | null {
	const row = db
		.prepare('SELECT id, data, papel, usuario FROM designacoes_info WHERE id = ?')
		.get(id) as Designacao;

	if (!row) return null;

	return row;
}
