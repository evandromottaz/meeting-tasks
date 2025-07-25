import { Request, Response } from 'express';
import { schema } from './schema';
import { MESSAGES } from './messages';
import { PermissionError, PermissionModel, PermissionRow } from './model';
import { PermissionRepository } from './repository';

export async function create(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new PermissionError(400, result.error.issues[0].message);

		const repository = new PermissionRepository(req.db);
		const model = new PermissionModel(repository);

		const permission = model.create(result.data);
		res.status(201).json(permission);
	} catch (error) {
		if (error instanceof PermissionError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar criar permissão.' });
	}
}

export async function getAll(req: Request, res: Response) {
	const repository = new PermissionRepository(req.db);
	const permissions = repository.listAll();
	res.status(200).json(permissions);
}

export async function getById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);

		const repository = new PermissionRepository(req.db);
		const permission = repository.getById(id);
		if (!permission) throw new PermissionError(404, 'Permissão não encontrada.');

		res.json(permission);
	} catch (error) {
		if (error instanceof PermissionError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao buscar permissão.' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new PermissionError(400, result.error.issues[0].message);

		const id = Number(req.params.id);
		if (isNaN(id)) throw new PermissionError(400, 'ID precisa ser um número');

		const { roleId, volunteerId } = result.data;
		const repository = new PermissionRepository(req.db);
		const model = new PermissionModel(repository);
		const permission = model.update({ roleId, volunteerId, id });

		res.json(permission);
	} catch (error) {
		if (error instanceof PermissionError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao atualizar permissão.' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) throw new PermissionError(400, 'ID precisa ser um número');

		const repository = new PermissionRepository(req.db);
		const model = new PermissionModel(repository);
		const permission = model.remove(id);

		res.json(permission);
	} catch (error) {
		if (error instanceof PermissionError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao deletar permissão.' });
	}
}
