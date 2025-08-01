import { Request, Response } from 'express';
import { schema } from './schema';
import { VolunteerError, VolunteerModel } from './model';
import { VolunteerRepository } from './repository';

export async function create(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new VolunteerError(400, result.error.issues[0].message);

		const repository = new VolunteerRepository(req.db);
		const model = new VolunteerModel(repository);
		const data = model.create(result.data.name);
		res.status(201).json(data);
	} catch (error) {
		if (error instanceof VolunteerError) return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar criar voluntário.' });
	}
}

export async function getAll(req: Request, res: Response) {
	const repository = new VolunteerRepository(req.db);
	const data = repository.listAll();
	res.status(200).json(data);
}

export async function getById(req: Request, res: Response) {
	try {
		const repository = new VolunteerRepository(req.db);
		const model = new VolunteerModel(repository);
		const data = model.getById(+req.params.id);
		res.json(data);
	} catch (error) {
		if (error instanceof VolunteerError) return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao buscar voluntário.' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new VolunteerError(400, result.error.issues[0].message);

		const repository = new VolunteerRepository(req.db);
		const model = new VolunteerModel(repository);
		const data = model.update({ name: result.data.name, id: +req.params.id });
		res.json(data);
	} catch (error) {
		if (error instanceof VolunteerError) return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao atualizar voluntário.' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const repository = new VolunteerRepository(req.db);
		const model = new VolunteerModel(repository);
		const data = model.remove(+req.params.id);
		res.json(data);
	} catch (error) {
		if (error instanceof VolunteerError) return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar deletar voluntário.' });
	}
}
