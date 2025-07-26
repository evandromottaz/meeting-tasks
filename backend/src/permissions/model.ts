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
	taskId: number;
	volunteerId: number;
}

interface SuccessReturning {
	data: Permission;
	message: string;
}

export class PermissionError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'permissionError';
		this.status = status;
	}
}

interface TaskRepository {
	getById: (id: number) => unknown;
}

interface VolunteerRepository {
	getById: (id: number) => unknown;
}

export class PermissionModel {
	constructor(
		readonly repository: PermissionRepository,
		private readonly taskRepository?: TaskRepository,
		private readonly volunteerRepository?: VolunteerRepository
	) {}

	create(permission: Permission): SuccessReturning {
		if (!this.volunteerRepository)
			throw new Error(PERMISSION_MESSAGES.VOLUNTEER_REPOSITORY_REQUIRED);

		if (!this.taskRepository) throw new Error(PERMISSION_MESSAGES.TASK_REPOSITORY_REQUIRED);

		const volunteer = this.volunteerRepository.getById(permission.volunteerId);
		if (!volunteer) throw new PermissionError(404, PERMISSION_MESSAGES.VOLUNTEER_NOT_FOUND);

		const task = this.taskRepository.getById(permission.taskId);
		if (!task) throw new PermissionError(404, PERMISSION_MESSAGES.TASK_NOT_FOUND);

		const alreadyExists = this.repository.findByVolunteerAndRole(permission);
		if (alreadyExists) throw new PermissionError(409, PERMISSION_MESSAGES.ALREADY_EXISTS);

		return {
			data: this.repository.create(permission),
			message: PERMISSION_MESSAGES.CREATED,
		};
	}

	update(permission: Permission): SuccessReturning {
		if (!this.volunteerRepository)
			throw new Error(PERMISSION_MESSAGES.VOLUNTEER_REPOSITORY_REQUIRED);

		if (!this.taskRepository) throw new Error(PERMISSION_MESSAGES.TASK_REPOSITORY_REQUIRED);

		if (isNaN(Number(permission.id)))
			throw new PermissionError(400, PERMISSION_MESSAGES.ID_INVALID);

		const volunteer = this.volunteerRepository.getById(permission.volunteerId);
		if (!volunteer) throw new PermissionError(404, PERMISSION_MESSAGES.VOLUNTEER_NOT_FOUND);

		const task = this.taskRepository.getById(permission.taskId);
		if (!task) throw new PermissionError(404, PERMISSION_MESSAGES.TASK_NOT_FOUND);

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
