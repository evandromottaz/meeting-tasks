import { PermissionRepository } from './repository';

export interface PermissionError {
	error: {
		message: string;
		status: number;
	} | null;
}

export interface Permission {
	id?: number;
	roleId: number;
	volunteerId: number;
}

export interface PermissionRow {
	id: number;
	role_id: number;
	volunteer_id: number;
}

export class PermissionError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'permissionError';
		this.status = status;
	}
}

export class PermissionModel {
	constructor(readonly repository: PermissionRepository) {
		this.repository = repository;
	}

	create(permission: Permission) {
		const volunteer = this.repository.getVolunteer(permission.volunteerId);
		if (!volunteer) throw new PermissionError(404, 'Voluntário não encontrado.');

		const role = this.repository.getRole(permission.roleId);
		if (!role) throw new PermissionError(404, 'Papel não encontrado.');

		const alreadyExists = this.repository.findByVolunteerAndRole(permission);
		if (alreadyExists) throw new PermissionError(409, 'Essa permissão já foi cadastrada.');

		return this.repository.create(permission);
	}

	update(permission: Permission) {
		const hasPermission = !!this.repository.getById(permission.id);
		if (!hasPermission) throw new PermissionError(404, 'Permissão não encontrada.');

		return this.repository.update(permission);
	}

	remove(id: Permission['id']) {
		const hasPermission = !!this.repository.getById(id);
		if (!hasPermission) throw new PermissionError(404, 'Permissão não encontrada.');

		this.repository.remove(id);
		return { message: 'Permissão deletada com sucesso', status: 200 };
	}
}
