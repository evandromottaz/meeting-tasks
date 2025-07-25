export const PERMISSION_MESSAGES = {
	CREATED: 'Permissão criada com sucesso',
	UPDATED: 'Permissão atualizada com sucesso',
	ALREADY_EXISTS: 'Essa permissão já foi cadastrada',
	ID_INVALID: '"id" precisa ser um número',
	TASK_ID_INVALID: '"taskId" precisa ser um número',
	VOLUNTEER_ID_INVALID: '"volunteerId" precisa ser um número',
	VOLUNTEER_NOT_FOUND: 'Voluntário não existe',
	TASK_NOT_FOUND: 'Tarefa não existe',
	NOT_FOUND: 'Permissão não encontrada',
	DELETED: 'Permissão deletada com sucesso',
	FOUND: 'Permissão encontrada',
	TASK_REPOSITORY_REQUIRED: 'TaskRepository é necessário',
	VOLUNTEER_REPOSITORY_REQUIRED: 'VolunteerRepository é necessário',
} as const;

export const TASK_MESSAGES = {
	TASK_ID_INVALID: '"taskId" precisa ser um número',
};

export const MEETING_MESSAGES = {
	CREATED: 'Designação criada com sucesso',
	UPDATED: 'Designação atualizada com sucesso',
	DELETED: 'Designação deletada com sucesso',
	NOT_FOUND: 'Designação não encontrada',
	PERMISSION_DENIED: 'Voluntário não tem permissão para essa designação',
	VOLUNTEER_NOT_FOUND: 'Voluntário não foi encontrado',
	TASK_NOT_FOUND: 'Tarefa não foi encontrada',
	ALREADY_EXISTS: 'Essa designação já foi cadastrada',
	ID_INVALID: '"id" precisa ser um número',
	DATE_INVALID_FORMAT: 'Formato do parâmetro "date" deve ser YYYY-MM-DD',
	DATE_INVALID_RANGE: 'Data só pode ser futura',
	DATE_INVALID: 'Data inválida',
	TASK_ID_INVALID: '"taskId" precisa ser um número',
	VOLUNTEER_ID_INVALID: '"volunteerId" precisa ser um número',
	FOUND: 'Designação encontrada',
	PERMISSION_REPOSITORY_REQUIRED: 'PermissionRepository é necessário',
	VOLUNTEER_REPOSITORY_REQUIRED: 'VolunteerRepository é necessário',
	TASK_REPOSITORY_REQUIRED: 'TaskRepository é necessário',
};
