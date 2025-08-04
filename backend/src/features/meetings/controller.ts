import { Request, Response } from 'express';
import { schema } from './schema';
import { Meeting } from './model';
import { MeetingRepository } from './repository';
import { TaskRepository } from '@/shared/tasks/repository';
import { VolunteerRepository } from '@/shared/volunteers/repository';
import { PermissionRepository } from '@/shared/permissions/repository';
import { parseFieldMinistryInput } from './utils';

export async function create(req: Request, res: Response) {
	try {
		const { error, data: meetingInput } = schema.safeParse(req.body);

		if (error) {
			return res.status(400).json({
				data: null,
				errors: error.issues.map(({ path, message }) => ({ message, path })),
				message: 'Erro ao criar reunião devido dados inválidos',
			});
		}

		const repository = new MeetingRepository(req.db);
		const permissionRepository = new PermissionRepository(req.db);
		const volunteerRepository = new VolunteerRepository(req.db);
		const taskRepository = new TaskRepository(req.db);
		const meeting = new Meeting({ repository, permissionRepository, volunteerRepository, taskRepository });

		const data = meeting.create({
			...meetingInput,
			fieldMinistry: parseFieldMinistryInput(meetingInput.fieldMinistry),
		});
		res.status(201).json(data);
	} catch (error) {
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
		const model = new Meeting({ repository });

		// const data = model.getById(+req.params.id);
		// res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao buscar designação' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const result = schema.safeParse(req.body);
		// if (!result.success) throw new BadRequestError(result.error.issues[0].message);

		const repository = new MeetingRepository(req.db);
		const permissionRepository = new PermissionRepository(req.db);
		const volunteerRepository = new VolunteerRepository(req.db);
		const taskRepository = new TaskRepository(req.db);
		const model = new Meeting({ repository, permissionRepository, volunteerRepository, taskRepository });

		// const data = model.update({ ...result.data, id: +req.params.id });
		// res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao atualizar permissão.' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const repository = new MeetingRepository(req.db);
		const model = new Meeting({ repository });

		// const data = model.remove(+req.params.id);
		// res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erro desconhecido ao deletar permissão.' });
	}
}
