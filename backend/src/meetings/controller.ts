import { Request, Response } from 'express';
import { schema, updateSchema } from './schema';
import { MeetingModel } from './model';
import { MeetingRepository } from './repository';
import { TaskRepository } from '@/tasks/repository';
import { VolunteerRepository } from '@/volunteers/repository';
import { PermissionRepository } from '@/permissions/repository';
import { BadRequestError, HttpError } from '@/shared/exceptions';

export async function create(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		if (!result.success) throw new BadRequestError(result.error.issues[0].message);

		const repository = new MeetingRepository(req.db);
		const permissionRepository = new PermissionRepository(req.db);
		const volunteerRepository = new VolunteerRepository(req.db);
		const taskRepository = new TaskRepository(req.db);
		const model = new MeetingModel({
			repository,
			permissionRepository,
			volunteerRepository,
			taskRepository,
		});

		const data = model.create(result.data);
		res.status(201).json(data);
	} catch (error) {
		if (error instanceof HttpError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao tentar criar designação' });
	}
}

export async function getAll(req: Request, res: Response) {
	const repository = new MeetingRepository(req.db);
	const data = repository.listAll();
	res.status(200).json({ data });
}

export async function getById(req: Request, res: Response) {
	try {
		const repository = new MeetingRepository(req.db);
		const model = new MeetingModel({ repository });

		const data = model.getById(+req.params.id);
		res.json(data);
	} catch (error) {
		if (error instanceof HttpError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao buscar designação' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const result = updateSchema.safeParse(req.body);
		if (!result.success) throw new BadRequestError(result.error.issues[0].message);

		const repository = new MeetingRepository(req.db);
		const permissionRepository = new PermissionRepository(req.db);
		const volunteerRepository = new VolunteerRepository(req.db);
		const taskRepository = new TaskRepository(req.db);
		const model = new MeetingModel({
			repository,
			permissionRepository,
			volunteerRepository,
			taskRepository,
		});

		const data = model.update({ ...result.data, id: +req.params.id });
		res.json(data);
	} catch (error) {
		if (error instanceof HttpError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao atualizar permissão.' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const repository = new MeetingRepository(req.db);
		const model = new MeetingModel({ repository });

		const data = model.remove(+req.params.id);
		res.json(data);
	} catch (error) {
		if (error instanceof HttpError)
			return res.status(error.status).json({ message: error.message });

		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao deletar permissão.' });
	}
}
