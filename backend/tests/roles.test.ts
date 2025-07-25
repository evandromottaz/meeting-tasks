import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';

let app: App;

beforeEach(() => {
	({ app } = setupTestApp());
});

const createRole = async (title = 'Indicador') => await request(app).post('/roles').send({ title });

describe('Cadastra', () => {
	describe('com sucesso', () => {
		it('papel', async () => {
			const res = await createRole();

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body.title).toBe('Indicador');
		});
		it('papel "   indicador  " e retorna "indicador"', async () => {
			const res = await createRole();

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body.title).toBe('Indicador');
		});
	});

	describe('com erro', () => {
		it('caso enviar "title" vazio', async () => {
			const res = await createRole('');

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Lista', () => {
	it('papéis', async () => {
		await createRole();

		const res = await request(app).get('/roles');
		expect(res.statusCode).toBe(200);
		expect(res.body).toStrictEqual([{ id: 1, title: 'Indicador' }]);
	});
});

describe('Busca', () => {
	describe('com sucesso', () => {
		it('1 papel', async () => {
			await createRole();

			const res = await request(app).get('/roles/1');
			expect(res.statusCode).toBe(200);
			expect(res.body).toStrictEqual({ id: 1, title: 'Indicador' });
		});
	});
	describe('com erro', () => {
		it('caso id não seja um número', async () => {
			await createRole();

			const res = await request(app).get('/roles/e');
			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
		it('caso papel não exista', async () => {
			await createRole();

			const res = await request(app).get('/roles/3');
			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Atualiza', () => {
	describe('com sucesso', () => {
		it('nome do papel', async () => {
			await createRole();

			const res = await request(app).put('/roles/1').send({ title: 'Microfone Volante' });
			expect(res.statusCode).toBe(200);
			expect(res.body.title).toBe('Microfone Volante');
		});
	});

	describe('com erro', () => {
		it('caso papel não exista', async () => {
			await request(app).post('/roles').send({ title: 'Indicador' });

			const res = await request(app).put('/roles/2').send({ title: 'Microfone Volante' });
			expect(res.statusCode).toBe(404);
		});
		it('caso id não for um número', async () => {
			await request(app).post('/roles').send({ title: 'Indicador' });

			const res = await request(app).put('/roles/e').send({ title: 'Microfone Volante' });
			expect(res.statusCode).toBe(400);
		});
	});
});

describe('Deleta', () => {
	describe('com sucesso', () => {
		it('o papel e envia uma mensagem', async () => {
			await request(app).post('/roles').send({ title: 'Indicador' });

			const res = await request(app).delete('/roles/1');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('message');
		});
	});

	describe('com erro', () => {
		it('caso papel não exista', async () => {
			await request(app).post('/roles').send({ title: 'Indicador' });

			const res = await request(app).delete('/roles/2');
			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
		it('caso id não for um número', async () => {
			await request(app).post('/roles').send({ title: 'Indicador' });

			const res = await request(app).delete('/roles/e');
			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});
