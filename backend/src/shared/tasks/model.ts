import { TaskRepository } from './repository';

export interface TaskError {
	error: {
		message: string;
		status: number;
	} | null;
}

export interface Task {
	id?: number;
	title: string;
}

export class TaskError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'taskError';
		this.status = status;
	}
}

export class TaskModel {
	constructor(readonly repository: TaskRepository) {
		this.repository = repository;
	}

	update(role: Task) {
		if (isNaN(Number(role.id))) throw new TaskError(400, 'ID precisa ser um número');

		const row = !!this.repository.getById(role.id);
		if (!row) throw new TaskError(404, 'Papel não encontrado.');

		return this.repository.update(role);
	}

	remove(id: Task['id']) {
		if (isNaN(Number(id))) throw new TaskError(400, 'ID precisa ser um número');

		const row = this.repository.getById(id);
		if (!row) throw new TaskError(404, 'Papel não encontrado.');

		this.repository.remove(id);
		return { message: 'Papel deletado com sucesso', status: 200 };
	}

	getById(id: Task['id']) {
		if (isNaN(Number(id))) throw new TaskError(400, 'ID precisa ser um número');

		const data = this.repository.getById(id);
		if (!data) throw new TaskError(404, 'Papel não encontrado.');

		return data;
	}
}
