import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';

let app: App;

beforeEach(() => {
	({ app } = setupTestApp());
});

const createTask = async (title = 'Indicador') => await request(app).post('/tasks').send({ title });
const getTask = async (id: number | string = '') => await request(app).get(`/tasks/${id}`);
const deleteTask = async (id: number | string = '') => await request(app).delete(`/tasks/${id}`);
const updateTask = async (id: number | string, title: string) =>
	await request(app).put(`/tasks/${id}`).send({ title });

describe('Cadastra', () => {
	describe('com sucesso', () => {
		it('papel', async () => {
			const res = await createTask();

			expect(res.status).toBe(201);
			expect(res.body).toStrictEqual({ id: 1, title: 'Indicador' });
		});
		it('papel "   indicador  " e retorna "indicador"', async () => {
			const res = await createTask();

			expect(res.status).toBe(201);
			expect(res.body).toStrictEqual({ id: 1, title: 'Indicador' });
		});
	});

	describe('com erro', () => {
		it('caso enviar "title" vazio', async () => {
			const res = await createTask('');

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Lista', () => {
	it('papéis', async () => {
		await createTask();

		const res = await getTask();

		expect(res.statusCode).toBe(200);
		expect(res.body).toStrictEqual([{ id: 1, title: 'Indicador' }]);
	});
});

describe('Busca', () => {
	describe('com sucesso', () => {
		it('1 papel', async () => {
			await createTask();

			const res = await getTask(1);

			expect(res.statusCode).toBe(200);
			expect(res.body).toStrictEqual({ id: 1, title: 'Indicador' });
		});
	});
	describe('com erro', () => {
		it('caso id não seja um número', async () => {
			await createTask();

			const res = await getTask('e');

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
		it('caso papel não exista', async () => {
			await createTask();

			const res = await getTask(3);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Atualiza', () => {
	describe('com sucesso', () => {
		it('nome do papel', async () => {
			await createTask();

			const res = await updateTask(1, 'Microfone Volante');

			expect(res.statusCode).toBe(200);
			expect(res.body.title).toBe('Microfone Volante');
		});
	});

	describe('com erro', () => {
		it('caso papel não exista', async () => {
			await createTask();
			const res = await updateTask(2, 'Microfone Volante');
			expect(res.statusCode).toBe(404);
		});
		it('caso id não for um número', async () => {
			await createTask();
			const res = await updateTask('e', 'Microfone Volante');
			expect(res.statusCode).toBe(400);
		});
	});
});

describe('Deleta tarefa', () => {
	describe('com sucesso', () => {
		it('o papel e envia uma mensagem', async () => {
			await createTask();

			const res = await deleteTask(1);

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('message');
		});
	});

	describe('com erro', () => {
		it('caso a tarefa não exista', async () => {
			await createTask();

			const res = await deleteTask(2);

			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
		it('caso id não for um número', async () => {
			await createTask();

			const res = await deleteTask('e');

			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});
