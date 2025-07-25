export interface Role {
	id: number;
	title: string;
}

export interface RoleRow {
	id: number;
	role_title: string;
}

export function createRole(row: RoleRow): Role {
	return {
		id: row.id,
		title: row.role_title,
	};
}
