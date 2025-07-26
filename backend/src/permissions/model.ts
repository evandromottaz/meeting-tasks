import { PERMISSION_MESSAGES } from '@/shared/const';
import { PermissionRepository } from './repository';

export interface PermissionError {
	error: {
		message: string;
		status: number;
	} | null;
}

export interface Permission {
	id?: number | bigint;
	roleId: number;
	volunteerId: number;
}

interface SuccessReturning {
	data: Permission;
	message: string;
}

export interface PermissionRow {
	id: number | bigint;
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

	create(permission: Permission): SuccessReturning {
		const volunteer = this.repository.getVolunteer(permission.volunteerId);
		if (!volunteer) throw new PermissionError(404, PERMISSION_MESSAGES.VOLUNTEER_NOT_FOUND);

		const role = this.repository.getRole(permission.roleId);
		if (!role) throw new PermissionError(404, PERMISSION_MESSAGES.TASK_NOT_FOUND);

		const alreadyExists = this.repository.findByVolunteerAndRole(permission);
		if (alreadyExists) throw new PermissionError(409, PERMISSION_MESSAGES.ALREADY_EXISTS);

		return {
			data: this.repository.create(permission),
			message: PERMISSION_MESSAGES.CREATED,
		};
	}

	update(permission: Permission): SuccessReturning {
		if (isNaN(Number(permission.id)))
			throw new PermissionError(400, PERMISSION_MESSAGES.ID_INVALID);

		const volunteer = this.repository.getVolunteer(permission.volunteerId);
		if (!volunteer) throw new PermissionError(404, PERMISSION_MESSAGES.VOLUNTEER_NOT_FOUND);

		const role = this.repository.getRole(permission.roleId);
		if (!role) throw new PermissionError(404, PERMISSION_MESSAGES.TASK_NOT_FOUND);

		const row = this.repository.getById(permission.id);
		if (!row) throw new PermissionError(404, PERMISSION_MESSAGES.NOT_FOUND);

		return {
			data: this.repository.update(permission),
			message: PERMISSION_MESSAGES.UPDATED,
		};
	}

	remove(id: Permission['id']) {
		if (isNaN(Number(id))) throw new PermissionError(400, PERMISSION_MESSAGES.ID_INVALID);

		const hasPermission = !!this.repository.getById(id);
		if (!hasPermission) throw new PermissionError(404, PERMISSION_MESSAGES.NOT_FOUND);

		this.repository.remove(id);
		return { message: PERMISSION_MESSAGES.DELETED, status: 200 };
	}

	getById(id: Permission['id']) {
		if (isNaN(Number(id))) throw new PermissionError(400, PERMISSION_MESSAGES.ID_INVALID);

		return { data: this.repository.getById(id), message: PERMISSION_MESSAGES.FOUND };
	}
}
