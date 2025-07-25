import { Request, Response } from 'express';
import { schema } from './schema';
import { RoleError, RoleModel } from './model';
import { RoleRepository } from './repository';

export async function create(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new RoleError(400, result.error.issues[0].message);

		const repository = new RoleRepository(req.db);
		const data = repository.create(result.data);
		res.status(201).json(data);
	} catch (error) {
		if (error instanceof RoleError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar criar papel.' });
	}
}

export async function getAll(req: Request, res: Response) {
	const repository = new RoleRepository(req.db);
	const data = repository.listAll();
	res.status(200).json(data);
}

export async function getById(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) throw new RoleError(400, 'ID precisa ser um número');

		const repository = new RoleRepository(req.db);
		const data = repository.getById(id);
		if (!data) throw new RoleError(404, 'papel não encontrado.');

		res.json(data);
	} catch (error) {
		if (error instanceof RoleError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao buscar papel.' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new RoleError(400, result.error.issues[0].message);

		const id = Number(req.params.id);
		if (isNaN(id)) throw new RoleError(400, 'ID precisa ser um número');

		const { title } = result.data;
		const repository = new RoleRepository(req.db);
		const model = new RoleModel(repository);
		const data = model.update({ title, id });

		res.json(data);
	} catch (error) {
		if (error instanceof RoleError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao atualizar permissão.' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) throw new RoleError(400, 'ID precisa ser um número');

		const repository = new RoleRepository(req.db);
		const model = new RoleModel(repository);
		const data = model.remove(id);

		res.json(data);
	} catch (error) {
		if (error instanceof RoleError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar deletar papel.' });
	}
}
