import { MEETING_MESSAGES, PERMISSION_MESSAGES } from '@/shared/const';
import { MeetingRepository } from './repository';
import { BadRequestError, ForbiddenError, NotFoundError } from '@/shared/exceptions';

export interface Meeting {
	id?: number | bigint;
	date: string;
	taskId: number;
	volunteerId: number;
}

export interface SuccessReturning {
	data: Meeting;
	message: string;
}

interface TaskRepository {
	getById: (id: number) => unknown;
}

interface VolunteerRepository {
	getById: (id: number) => unknown;
}

interface PermissionRepository {
	findByVolunteerAndTask: ({
		taskId,
		volunteerId,
	}: Pick<Meeting, 'taskId' | 'volunteerId'>) => unknown;
}

interface Props {
	readonly repository: MeetingRepository;
	readonly permissionRepository?: PermissionRepository;
	readonly volunteerRepository?: VolunteerRepository;
	readonly taskRepository?: TaskRepository;
}

export class MeetingModel {
	private readonly repository: MeetingRepository;
	private readonly permissionRepository?: PermissionRepository;
	private readonly volunteerRepository?: VolunteerRepository;
	private readonly taskRepository?: TaskRepository;

	constructor({ repository, permissionRepository, volunteerRepository, taskRepository }: Props) {
		this.repository = repository;
		this.permissionRepository = permissionRepository;
		this.volunteerRepository = volunteerRepository;
		this.taskRepository = taskRepository;
	}

	create(meeting: Meeting): SuccessReturning {
		if (!this.permissionRepository)
			throw new Error(MEETING_MESSAGES.PERMISSION_REPOSITORY_REQUIRED);

		if (!this.volunteerRepository) throw new Error(MEETING_MESSAGES.VOLUNTEER_REPOSITORY_REQUIRED);

		if (!this.taskRepository) throw new Error(MEETING_MESSAGES.TASK_REPOSITORY_REQUIRED);

		const volunteer = this.volunteerRepository.getById(meeting.volunteerId);
		if (!volunteer) throw new NotFoundError(MEETING_MESSAGES.VOLUNTEER_NOT_FOUND);

		const task = this.taskRepository.getById(meeting.taskId);
		if (!task) throw new NotFoundError(MEETING_MESSAGES.TASK_NOT_FOUND);

		const hasPermission = !!this.permissionRepository.findByVolunteerAndTask(meeting);
		if (!hasPermission) throw new ForbiddenError(MEETING_MESSAGES.PERMISSION_DENIED);

		return {
			data: this.repository.create(meeting),
			message: MEETING_MESSAGES.CREATED,
		};
	}

	getById(id: Meeting['id']): SuccessReturning {
		if (isNaN(Number(id))) throw new BadRequestError(MEETING_MESSAGES.ID_INVALID);

		const data = this.repository.getById(id);
		return { data, message: MEETING_MESSAGES.FOUND };
	}

	update(meeting: Omit<Meeting, 'date'>): SuccessReturning {
		if (isNaN(Number(meeting.id))) throw new BadRequestError(MEETING_MESSAGES.ID_INVALID);

		if (!this.volunteerRepository) throw new Error(MEETING_MESSAGES.VOLUNTEER_REPOSITORY_REQUIRED);

		if (!this.taskRepository) throw new Error(MEETING_MESSAGES.TASK_REPOSITORY_REQUIRED);

		if (!this.permissionRepository)
			throw new Error(MEETING_MESSAGES.PERMISSION_REPOSITORY_REQUIRED);

		const volunteer = this.volunteerRepository.getById(meeting.volunteerId);
		if (!volunteer) throw new NotFoundError(MEETING_MESSAGES.VOLUNTEER_NOT_FOUND);

		const task = this.taskRepository.getById(meeting.taskId);
		if (!task) throw new NotFoundError(MEETING_MESSAGES.TASK_NOT_FOUND);

		const hasPermission = !!this.permissionRepository.findByVolunteerAndTask(meeting);
		if (!hasPermission) throw new ForbiddenError(MEETING_MESSAGES.PERMISSION_DENIED);

		return { data: this.repository.update(meeting), message: MEETING_MESSAGES.UPDATED };
	}

	remove(id: Meeting['id']) {
		if (isNaN(Number(id))) throw new BadRequestError(MEETING_MESSAGES.ID_INVALID);

		this.repository.remove(id);
		return { message: MEETING_MESSAGES.DELETED };
	}
}
