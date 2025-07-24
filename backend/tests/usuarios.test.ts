import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { createApp, App } from '@/index';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve(__dirname, './schema.test.sql');

let db: InstanceType<typeof Database>;
let app: App;

beforeEach(() => {
	db = new Database(':memory:');
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	db.exec(schema);
	app = createApp(db);
});

describe('Cadastro de usuários', () => {
	it('deve cadastrar um novo usuário', async () => {
		const res = await request(app)
			.post('/usuarios')
			.send({ nome: 'Evandro', email: 'evandro@email.com' });

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.nome).toBe('Evandro');
	});
	it('deve listar todos os usuários', async () => {
		await request(app).post('/usuarios').send({ nome: 'Evandro' });

		const res = await request(app).get('/usuarios');

		expect(res.statusCode).toBe(200);
		expect(res.body).toStrictEqual([{ id: 1, nome: 'Evandro' }]);
	});
	it('deve atualizar o nome do usuário', async () => {
		await request(app).post('/usuarios').send({ nome: 'Antigo Nome' });

		const res = await request(app).put('/usuarios/1').send({ nome: 'Novo Nome' });

		expect(res.statusCode).toBe(200);
		expect(res.body.nome).toBe('Novo Nome');
	});
	it('deve deletar do usuário e enviar uma mensagem', async () => {
		await request(app).post('/usuarios').send({ nome: 'Antigo Nome' });

		const res = await request(app).delete('/usuarios/1');

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('message');
	});
});
