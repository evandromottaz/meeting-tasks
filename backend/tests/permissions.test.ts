import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';

let app: App;

beforeEach(async () => {
	({ app } = setupTestApp());
});

const createVolunteer = (name = 'Evandro') => request(app).post('/volunteers').send({ name });

const createRole = (title = 'Indicador') => request(app).post('/roles').send({ title });

const createPermission = (roleId = 1, volunteerId = 1) =>
	request(app).post('/permissions').send({ roleId, volunteerId });

const makeSut = async ({ volunteer = true, role = true } = {}) => {
	if (volunteer) await createVolunteer();
	if (role) await createRole();
	return await createPermission(1, 1);
};

describe('Cadastra', () => {
	describe('com sucesso', () => {
		it('permissão', async () => {
			const res = await makeSut();
			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('id');
		});
	});
	describe('com erro', () => {
		it('caso permissão já exista', async () => {
			await makeSut();
			const res = await createPermission(1, 1);
			expect(res.status).toBe(409);
			expect(res.body).toHaveProperty('message');
		});
		it('caso voluntário não exista', async () => {
			const res = await makeSut({ volunteer: false });
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
		it('caso papel não exista', async () => {
			const res = await makeSut({ role: false });
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Lista', () => {
	describe('com sucesso', () => {
		it('permissões', async () => {
			await makeSut();
			const res = await request(app).get('/permissions');
			expect(res.status).toBe(200);
			expect(res.body).toStrictEqual([{ id: 1, roleId: 1, volunteerId: 1 }]);
		});
		it('1 permissão', async () => {
			await makeSut();
			const res = await request(app).get('/permissions/1');
			expect(res.status).toBe(200);
			expect(res.body).toStrictEqual({ id: 1, roleId: 1, volunteerId: 1 });
		});
	});
});

describe('Edita', () => {
	describe('com sucesso', () => {
		it('permissão', async () => {
			await makeSut();
			await createRole('Volante');
			const res = await request(app).put('/permissions/1').send({ roleId: 2, volunteerId: 1 });
			expect(res.status).toBe(200);
			expect(res.body).toStrictEqual({ id: 1, roleId: 2, volunteerId: 1 });
		});
	});
	describe('com erro', () => {
		it('caso permissão não exista', async () => {
			await makeSut();
			const res = await request(app).put('/permissions/2').send({ roleId: 1, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
		it('caso voluntário não exista', async () => {
			await makeSut({ volunteer: false });
			const res = await request(app).put('/permissions/1').send({ roleId: 1, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
		it('caso papel não exista', async () => {
			await makeSut({ role: false });
			const res = await request(app).put('/permissions/1').send({ roleId: 1, volunteerId: 1 });
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
	});
});

describe('Deleta', () => {
	describe('com sucesso', () => {
		it('permissão', async () => {
			await makeSut();
			const res = await request(app).delete('/permissions/1');
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('message');
		});
	});
	describe('com erro', () => {
		it('caso não exista essa permissão', async () => {
			await makeSut();
			const res = await request(app).delete('/permissions/2');
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('message');
		});
	});
});
