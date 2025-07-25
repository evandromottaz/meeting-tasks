import { VolunteerRepository } from './repository';

export interface VolunteerError {
	error: {
		message: string;
		status: number;
	} | null;
}

export interface Volunteer {
	id?: number;
	name: string;
}

export class VolunteerError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'volunteerError';
		this.status = status;
	}
}

export class VolunteerModel {
	constructor(readonly repository: VolunteerRepository) {
		this.repository = repository;
	}

	update(volunteer: Volunteer) {
		if (isNaN(Number(volunteer.id))) throw new VolunteerError(400, 'ID precisa ser um número');

		const row = !!this.repository.getById(volunteer.id);
		if (!row) throw new VolunteerError(404, 'Voluntário não encontrado.');

		return this.repository.update(volunteer);
	}

	remove(id: Volunteer['id']) {
		if (isNaN(Number(id))) throw new VolunteerError(400, 'ID precisa ser um número');

		const row = this.repository.getById(id);
		if (!row) throw new VolunteerError(404, 'Voluntário não encontrado.');

		this.repository.remove(id);
		return { message: 'Voluntário deletado com sucesso', status: 200 };
	}

	getById(id: Volunteer['id']) {
		if (isNaN(Number(id))) throw new VolunteerError(400, 'ID precisa ser um número');

		return this.repository.getById(id);
	}
}
