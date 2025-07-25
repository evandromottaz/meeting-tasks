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
		it('usuário', async () => {
			const res = await request(app).post('/users').send({ name: 'Evandro' });

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('id');
			expect(res.body.name).toBe('Evandro');
		});
	});

	describe('com erro', () => {
		it('caso parâmetro "name" não for passado', async () => {
			const res = await request(app).post('/users').send({ x: 'Evandro' });

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Lista', () => {
	it('todos os usuários', async () => {
		await request(app).post('/users').send({ name: 'Evandro' });

		const res = await request(app).get('/users');
		expect(res.statusCode).toBe(200);
		expect(res.body).toStrictEqual([{ id: 1, name: 'Evandro' }]);
	});
});

describe('Atualiza', () => {
	describe('com sucesso', () => {
		it('nome do usuário', async () => {
			await request(app).post('/users').send({ name: 'Antigo name' });

			const res = await request(app).put('/users/1').send({ name: 'Novo name' });
			expect(res.statusCode).toBe(200);
			expect(res.body.name).toBe('Novo name');
		});
	});

	describe('com erro', () => {
		it('caso id do usuário não existir', async () => {
			await request(app).post('/users').send({ name: 'Antigo name' });

			const res = await request(app).put('/users/2').send({ name: 'Novo name' });
			expect(res.statusCode).toBe(404);
		});
		it('caso id não for um número', async () => {
			await request(app).post('/users').send({ name: 'Antigo name' });

			const res = await request(app).put('/users/e').send({ name: 'Novo name' });
			expect(res.statusCode).toBe(404);
		});
	});
});

describe('Deleta', () => {
	describe('com sucesso', () => {
		it('o usuário e envia uma mensagem', async () => {
			await request(app).post('/users').send({ name: 'Antigo name' });

			const res = await request(app).delete('/users/1');

			expect(res.statusCode).toBe(200);
			expect(res.body).toHaveProperty('message');
		});
	});

	describe('com erro', () => {
		it('caso id do usuário não existir', async () => {
			await request(app).post('/users').send({ name: 'Antigo name' });

			const res = await request(app).delete('/users/2');
			expect(res.statusCode).toBe(404);
		});
		it('caso id não for um número', async () => {
			await request(app).post('/users').send({ name: 'Antigo name' });

			const res = await request(app).delete('/users/e');
			expect(res.statusCode).toBe(404);
		});
	});
});
