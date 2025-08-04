import { Request, Response } from 'express';
import { schema } from './schema';
import { TaskError, TaskModel } from './model';
import { TaskRepository } from './repository';

export async function create(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new TaskError(400, result.error.issues[0].message);

		const repository = new TaskRepository(req.db);
		const data = repository.create(result.data);
		res.status(201).json(data);
	} catch (error) {
		if (error instanceof TaskError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar criar tarefa' });
	}
}

export async function getAll(req: Request, res: Response) {
	const repository = new TaskRepository(req.db);
	const data = repository.listAll();
	res.status(200).json(data);
}

export async function getById(req: Request, res: Response) {
	try {
		const repository = new TaskRepository(req.db);
		const model = new TaskModel(repository);
		const data = model.getById(+req.params.id);
		res.json(data);
	} catch (error) {
		if (error instanceof TaskError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao buscar tarefa' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new TaskError(400, result.error.issues[0].message);

		const repository = new TaskRepository(req.db);
		const model = new TaskModel(repository);
		const data = model.update({ title: result.data.title, id: +req.params.id });
		res.json(data);
	} catch (error) {
		if (error instanceof TaskError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao atualizar tarefa' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const repository = new TaskRepository(req.db);
		const model = new TaskModel(repository);
		const data = model.remove(+req.params.id);
		res.json(data);
	} catch (error) {
		if (error instanceof TaskError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar deletar tarefa' });
	}
}
