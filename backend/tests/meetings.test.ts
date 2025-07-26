import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';
import { MEETING_MESSAGES } from '@/shared/const';

let app: App;

type Values = {
	date: string;
	taskId?: number | string;
	volunteerId?: number | string;
};

type DefaultValues = {
	task: boolean;
	volunteer: boolean;
	permission: boolean;
} & Values;

const defaultValues: DefaultValues = {
	date: '2025-07-26',
	volunteerId: 1,
	taskId: 1,
	task: true,
	volunteer: true,
	permission: true,
};

beforeEach(async () => {
	({ app } = setupTestApp());
});

const createVolunteer = (name = 'Evandro') => request(app).post('/volunteers').send({ name });

const createRole = (title = 'Indicador') => request(app).post('/tasks').send({ title });

const createPermission = (permission: Omit<Values, 'date'>) =>
	request(app).post('/permissions').send(permission);

const createMeeting = (meeting: Values) => request(app).post('/meetings').send(meeting);
const getMeetings = (id: number | string = '') => request(app).get(`/meetings/${id}`);

const makeSut = async (values = defaultValues) => {
	const { volunteer, task, permission, date, taskId, volunteerId } = values;

	if (volunteer) await createVolunteer();
	if (task) await createRole();
	if (permission) await createPermission({ taskId, volunteerId });

	return await createMeeting({ date, taskId, volunteerId });
};

describe.only('Cadastra designação', () => {
	it('com sucesso', async () => {
		const res = await makeSut();
		expect(res.status).toBe(201);
		expect(res.body.data).toStrictEqual({
			id: 1,
			date: defaultValues.date,
			taskId: 1,
			volunteerId: 1,
		});
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

describe.only('Busca designação', () => {
	it('com sucesso', async () => {
		await makeSut();

		const res = await getMeetings();
		expect(res.status).toBe(200);
		expect(res.body.data).toStrictEqual([
			{
				id: 1,
				date: defaultValues.date,
				taskId: 1,
				volunteerId: 1,
			},
		]);
	});
});
