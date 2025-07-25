import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';
import { PERMISSION_MESSAGES, TASK_MESSAGES } from '@/shared/const';

let app: App;

type Values = {
	taskId?: number | string;
	volunteerId?: number | string;
};

type DefaultValues = {
	task: boolean;
	volunteer: boolean;
} & Values;

const defaultValues: DefaultValues = {
	volunteerId: 1,
	taskId: 1,
	task: true,
	volunteer: true,
};

beforeEach(async () => {
	({ app } = setupTestApp());
});

const createVolunteer = (name = 'Evandro') => request(app).post('/volunteers').send({ name });

const createRole = (title = 'Indicador') => request(app).post('/tasks').send({ title });

const createPermission = ({ taskId = 1, volunteerId = 1 }: Values = {}) =>
	request(app).post('/permissions').send({ taskId, volunteerId });

const makeSut = async (values = defaultValues) => {
	const { volunteer, task, taskId, volunteerId } = values;
	if (volunteer) await createVolunteer();
	if (task) await createRole();
	return await createPermission({ taskId, volunteerId });
};

describe('Cadastra permissão', () => {
	describe('com sucesso', () => {
		it('permissão', async () => {
			const res = await makeSut();
			expect(res.status).toBe(201);
			expect(res.body.data).toStrictEqual({ id: 1, taskId: 1, volunteerId: 1 });
			expect(res.body.message).toBe(PERMISSION_MESSAGES.CREATED);
		});
	});
	describe('com erro', () => {
		it('caso permissão já exista', async () => {
			await makeSut();
			const res = await createPermission();
			expect(res.status).toBe(409);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.ALREADY_EXISTS);
		});
		it('caso voluntário não exista', async () => {
			const res = await makeSut({ ...defaultValues, volunteer: false });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.VOLUNTEER_NOT_FOUND);
		});
		it('caso tarefa não exista', async () => {
			const res = await makeSut({ ...defaultValues, task: false });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.TASK_NOT_FOUND);
		});
		it('caso "taskId" não seja um número', async () => {
			const res = await makeSut({ ...defaultValues, taskId: 'e' });
			expect(res.status).toBe(400);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.TASK_ID_INVALID);
		});
	});
});

describe('Lista permissão', () => {
	it('permissões', async () => {
		await makeSut();
		const res = await request(app).get('/permissions');
		expect(res.status).toBe(200);
		expect(res.body).toStrictEqual([{ id: 1, taskId: 1, volunteerId: 1 }]);
	});
});

describe('Busca permissão', () => {
	describe('com sucesso', () => {
		it('1 permissão', async () => {
			await makeSut();
			const res = await request(app).get('/permissions/1');

			expect(res.status).toBe(200);
			expect(res.body.data).toStrictEqual({ id: 1, taskId: 1, volunteerId: 1 });
			expect(res.body.message).toBe(PERMISSION_MESSAGES.FOUND);
		});
	});
	describe('com erro', () => {
		it('caso id não seja um número', async () => {
			await makeSut();
			const res = await request(app).get('/permissions/e');

			expect(res.status).toBe(400);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.ID_INVALID);
		});
		it('caso permissão não exista', async () => {
			await makeSut();
			const res = await request(app).get('/permissions/32');

			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.NOT_FOUND);
		});
	});
});

describe('Edita permissão', () => {
	describe('com sucesso', () => {
		it('permissão', async () => {
			await makeSut();
			await createRole('Volante');
			const res = await request(app).put('/permissions/1').send({ taskId: 2, volunteerId: 1 });

			expect(res.status).toBe(200);
			expect(res.body.data).toStrictEqual({ id: 1, taskId: 2, volunteerId: 1 });
			expect(res.body.message).toBe(PERMISSION_MESSAGES.UPDATED);
		});
	});
	describe('com erro', () => {
		it('caso permissão não exista', async () => {
			await makeSut();
			const res = await request(app).put('/permissions/2').send({ taskId: 1, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.NOT_FOUND);
		});
		it('caso voluntário não exista', async () => {
			await makeSut({ ...defaultValues, volunteer: false });
			const res = await request(app).put('/permissions/1').send({ taskId: 1, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.VOLUNTEER_NOT_FOUND);
		});
		it('caso tarefa não exista', async () => {
			await makeSut();
			const res = await request(app).put('/permissions/1').send({ taskId: 2, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.TASK_NOT_FOUND);
		});
	});
});

describe('Deleta', () => {
	describe('com sucesso', () => {
		it('permissão', async () => {
			await makeSut();
			const res = await request(app).delete('/permissions/1');
			expect(res.status).toBe(200);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.DELETED);
		});
	});
	describe('com erro', () => {
		it('caso não exista essa permissão', async () => {
			await makeSut();
			const res = await request(app).delete('/permissions/2');
			expect(res.status).toBe(404);
			expect(res.body.message).toBe(PERMISSION_MESSAGES.NOT_FOUND);
		});
	});
});
