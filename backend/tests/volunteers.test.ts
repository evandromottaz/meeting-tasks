import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';

let app: App;

beforeEach(() => {
	({ app } = setupTestApp());
});

describe('Cadastra', () => {
	describe('com sucesso', () => {
		it('voluntário', async () => {
			const res = await request(app).post('/volunteers').send({ name: 'Evandro' });

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body.name).toBe('Evandro');
		});
	});

	describe('com erro', () => {
		it('caso parâmetro "name" não for passado', async () => {
			const res = await request(app).post('/volunteers').send({ x: 'Evandro' });

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Lista', () => {
	it('todos os voluntários', async () => {
		await request(app).post('/volunteers').send({ name: 'Evandro' });

		const res = await request(app).get('/volunteers');
		expect(res.statusCode).toBe(200);
		expect(res.body).toStrictEqual([{ id: 1, name: 'Evandro' }]);
	});
});

describe('Atualiza', () => {
	describe('com sucesso', () => {
		it('nome do voluntário', async () => {
			await request(app).post('/volunteers').send({ name: 'Antigo name' });

			const res = await request(app).put('/volunteers/1').send({ name: 'Novo name' });
			expect(res.statusCode).toBe(200);
			expect(res.body.name).toBe('Novo name');
		});
	});

	describe('com erro', () => {
		it('caso id do voluntário não existir', async () => {
			await request(app).post('/volunteers').send({ name: 'Antigo name' });

			const res = await request(app).put('/volunteers/2').send({ name: 'Novo name' });
			expect(res.statusCode).toBe(404);
		});
		it('caso id não for um número', async () => {
			await request(app).post('/volunteers').send({ name: 'Antigo name' });

			const res = await request(app).put('/volunteers/e').send({ name: 'Novo name' });
			expect(res.statusCode).toBe(400);
		});
	});
});

describe('Deleta', () => {
	describe('com sucesso', () => {
		it('o voluntário e envia uma mensagem', async () => {
			await request(app).post('/volunteers').send({ name: 'Antigo name' });

			const res = await request(app).delete('/volunteers/1');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('message');
		});
	});

	describe('com erro', () => {
		it('caso id do voluntário não existir', async () => {
			await request(app).post('/volunteers').send({ name: 'Antigo name' });

			const res = await request(app).delete('/volunteers/2');
			expect(res.statusCode).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
		it('caso id não for um número', async () => {
			await request(app).post('/volunteers').send({ name: 'Antigo name' });

			const res = await request(app).delete('/volunteers/e');
			expect(res.statusCode).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});
