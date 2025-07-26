import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';
import { MEETING_MESSAGES } from '@/shared/const';

let app: App;

type Values = {
	date?: string;
	taskId?: number | string;
	volunteerId?: number | string;
};

type DefaultValues = {
	task: boolean;
	volunteer: boolean;
	permission: boolean;
} & Values;

const values: Values = {
	date: '2025-07-26',
	volunteerId: 1,
	taskId: 1,
};

const defaultValues: DefaultValues = {
	...values,
	task: true,
	volunteer: true,
	permission: true,
};

beforeEach(async () => {
	({ app } = setupTestApp());
});

const createVolunteer = (name = 'Evandro') => request(app).post('/volunteers').send({ name });

const createTask = (title = 'Indicador') => request(app).post('/tasks').send({ title });

const createPermission = (permission: Omit<Values, 'date'>) =>
	request(app).post('/permissions').send(permission);

const createMeeting = (meeting: Values) => request(app).post('/meetings').send(meeting);
const getMeetings = (id: number | string = '') => request(app).get(`/meetings/${id}`);
const updateMeeting = (id: number | string, values: Values) =>
	request(app).patch(`/meetings/${id}`).send(values);
const deleteMeetings = (id: number | string) => request(app).delete(`/meetings/${id}`);

const makeSut = async (values = defaultValues) => {
	const { volunteer, task, permission, date, taskId, volunteerId } = values;

	if (volunteer) await createVolunteer();
	if (task) await createTask();
	if (permission) await createPermission({ taskId, volunteerId });

	return await createMeeting({ date, taskId, volunteerId });
};

describe('Cadastra designação', () => {
	it('com sucesso', async () => {
		const res = await makeSut();
		expect(res.status).toBe(201);
		expect(res.body.data).toStrictEqual({ ...values, id: 1 });
		expect(res.body.message).toBe(MEETING_MESSAGES.CREATED);
	});

	describe('com erro', () => {
		it('caso tarefa não exista', async () => {
			const res = await makeSut({ ...defaultValues, taskId: 3 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(MEETING_MESSAGES.VOLUNTEER_NOT_FOUND);
		});
		it('caso voluntário não exista', async () => {
			const res = await makeSut({ ...defaultValues, volunteerId: 3 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(MEETING_MESSAGES.VOLUNTEER_NOT_FOUND);
		});
		it('caso voluntário não tenha permissão', async () => {
			const res = await makeSut({ ...defaultValues, permission: false });
			expect(res.status).toBe(403);
			expect(res.body.message).toBe(MEETING_MESSAGES.PERMISSION_DENIED);
		});
	});
});

describe('Lista designações', () => {
	it('com sucesso', async () => {
		await makeSut();

		const res = await getMeetings();
		expect(res.status).toBe(200);
		expect(res.body.data).toStrictEqual([
			{
				...values,
				id: 1,
			},
		]);
	});
});

describe('Busca designação', () => {
	describe('com sucesso', () => {
		it('pelo id', async () => {
			await makeSut();

			const res = await getMeetings(1);
			expect(res.status).toBe(200);
			expect(res.body.data).toStrictEqual({ ...values, id: 1 });
			expect(res.body.message).toBe(MEETING_MESSAGES.FOUND);
		});
	});

	describe('com erro', () => {
		it('caso designação não exista', async () => {
			await makeSut();

			const res = await getMeetings(33);
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(MEETING_MESSAGES.NOT_FOUND);
		});
		it('caso "id" não seja um número', async () => {
			await makeSut();

			const res = await getMeetings('e');
			expect(res.status).toBe(400);
			expect(res.body.message).toBe(MEETING_MESSAGES.ID_INVALID);
		});
	});
});

describe('Edita designação', () => {
	describe('com sucesso', () => {
		it('outro voluntário para a tarefa', async () => {
			await makeSut();
			await createVolunteer('João');
			await createPermission({ volunteerId: 2, taskId: 1 });

			const res = await updateMeeting(1, { taskId: 1, volunteerId: 2 });
			expect(res.status).toBe(200);
			expect(res.body.data).toStrictEqual({ ...values, volunteerId: 2, id: 1 });
			expect(res.body.message).toBe(MEETING_MESSAGES.UPDATED);
		});
		it('mesmo voluntário para outra tarefa', async () => {
			await makeSut();
			await createTask('Leitor');
			await createPermission({ volunteerId: 1, taskId: 2 });

			const res = await updateMeeting(1, { taskId: 2, volunteerId: 1 });
			expect(res.status).toBe(200);
			expect(res.body.data).toStrictEqual({ ...values, taskId: 2, id: 1 });
			expect(res.body.message).toBe(MEETING_MESSAGES.UPDATED);
		});
	});
	describe('com erro', () => {
		it('caso voluntário não tenha permissão para designação', async () => {
			await makeSut();
			await createVolunteer('João');

			const res = await updateMeeting(1, { taskId: 1, volunteerId: 2 });
			expect(res.status).toBe(403);
			expect(res.body.message).toBe(MEETING_MESSAGES.PERMISSION_DENIED);
		});
		it('caso voluntário não exista', async () => {
			await makeSut();

			const res = await updateMeeting(1, { taskId: 1, volunteerId: 2 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(MEETING_MESSAGES.VOLUNTEER_NOT_FOUND);
		});
		it('caso tarefa não exista', async () => {
			await makeSut();

			const res = await updateMeeting(1, { taskId: 2, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(MEETING_MESSAGES.TASK_NOT_FOUND);
		});
	});
});

describe('Deleta designação', () => {
	it('com sucesso', async () => {
		await makeSut();

		const res = await deleteMeetings(1);

		expect(res.status).toBe(200);
		expect(res.body.message).toBe(MEETING_MESSAGES.DELETED);
	});

	describe('com erro', () => {
		it('caso designação não exista', async () => {
			await makeSut();

			const res = await deleteMeetings(2);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe(MEETING_MESSAGES.NOT_FOUND);
		});
		it('caso "id" não seja um número', async () => {
			await makeSut();

			const res = await deleteMeetings('e');

			expect(res.status).toBe(400);
			expect(res.body.message).toBe(MEETING_MESSAGES.ID_INVALID);
		});
	});
});
