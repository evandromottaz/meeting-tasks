export interface Volunteer {
	id: number;
	name: string;
}

export interface VolunteerRow {
	id: number;
	volunteer_name: string;
}

export function createVolunteer(row: VolunteerRow): Volunteer {
	return {
		id: row.id,
		name: row.volunteer_name,
	};
}
