import { RoleRepository } from './repository';

export interface RoleError {
	error: {
		message: string;
		status: number;
	} | null;
}

export interface Role {
	id?: number;
	title: string;
}

export interface RoleRow {
	id: number;
	role_title: string;
}

export class RoleError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'roleError';
		this.status = status;
	}
}

export class RoleModel {
	constructor(readonly repository: RoleRepository) {
		this.repository = repository;
	}

	update(role: Role) {
		if (isNaN(Number(role.id))) throw new RoleError(400, 'ID precisa ser um número');

		const row = !!this.repository.getById(role.id);
		if (!row) throw new RoleError(404, 'Papel não encontrado.');

		return this.repository.update(role);
	}

	remove(id: Role['id']) {
		if (isNaN(Number(id))) throw new RoleError(400, 'ID precisa ser um número');

		const row = this.repository.getById(id);
		if (!row) throw new RoleError(404, 'Papel não encontrado.');

		this.repository.remove(id);
		return { message: 'Papel deletado com sucesso', status: 200 };
	}

	getById(id: Role['id']) {
		if (isNaN(Number(id))) throw new RoleError(400, 'ID precisa ser um número');

		const data = this.repository.getById(id);
		if (!data) throw new RoleError(404, 'Papel não encontrado.');

		return data;
	}
}
