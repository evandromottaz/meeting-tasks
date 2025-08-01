import { MEETING_MESSAGES } from '@/shared/messages';
import { MeetingTasks } from './enums';
import { MeetingInput, Repositories, IMeeting, IMeetingRepository, MeetingOutput } from './types';
import { Result } from '@/shared/types/result-pattern';

const { BOOK_STUDY_DIRECTOR, BOOK_STUDY_READER, CHAIRMAN, SPIRITUAL_GEMS_DIRECTOR, TREASURES_SPEAKER, CHRISTIAN_LIFE } =
	MeetingTasks;

export class Meeting implements IMeeting {
	private readonly repository: IMeetingRepository;
	private readonly permissionRepository?: Repositories['permissionRepository'];
	private readonly volunteerRepository?: Repositories['volunteerRepository'];
	private readonly taskRepository?: Repositories['taskRepository'];

	constructor({ repository, permissionRepository, volunteerRepository, taskRepository }: Repositories) {
		this.repository = repository;
		this.permissionRepository = permissionRepository;
		this.volunteerRepository = volunteerRepository;
		this.taskRepository = taskRepository;
	}

	create(meeting: MeetingInput): Result<MeetingOutput> {
		if (!this.permissionRepository) throw new Error(MEETING_MESSAGES.PERMISSION_REPOSITORY_REQUIRED);
		if (!this.volunteerRepository) throw new Error(MEETING_MESSAGES.VOLUNTEER_REPOSITORY_REQUIRED);
		if (!this.taskRepository) throw new Error(MEETING_MESSAGES.TASK_REPOSITORY_REQUIRED);

		const errorsVolunteers = this.getVolunteersErrors(meeting);
		if (errorsVolunteers.length)
			return { ok: false, errors: errorsVolunteers, message: MEETING_MESSAGES.VOLUNTEER_NOT_FOUND };

		const errorPermissions = this.getPermissionsErrors(meeting);
		if (errorPermissions.length)
			return { errors: errorPermissions, message: MEETING_MESSAGES.CREATED_ERROR_PERMISSION, ok: false };

		const date = new Date(meeting.date).getTime();
		if (isNaN(date)) return { message: MEETING_MESSAGES.DATE_INVALID, ok: false };

		const isFutureDate = new Date().getTime() < date;
		if (!isFutureDate) return { message: MEETING_MESSAGES.DATE_INVALID_RANGE, ok: false };

		return {
			data: this.repository.create(meeting),
			message: MEETING_MESSAGES.CREATED,
			ok: true,
		};
	}

	private getVolunteersErrors({ fieldMinistry, christianLife, ...meeting }: MeetingInput) {
		const volunteersMapper = new Map<number, boolean>();
		Object.values(meeting).forEach((volunteerId) => {
			if (isNaN(+volunteerId)) return;

			volunteersMapper.set(+volunteerId, true);
		});

		volunteersMapper.forEach((_, id) => {
			volunteersMapper.set(id, !!this.volunteerRepository!.getById(id));
		});

		return [...volunteersMapper.entries()]
			.filter(([, exists]) => !exists)
			.map(([id]) => `ID ${id} não está cadastrado.`);
	}

	private getPermissionsErrors(meeting: MeetingInput) {
		const permissionMapper = new Map<string, { taskTitle: MeetingTasks; volunteerId: number }>();

		const meetingTasks: [keyof Omit<MeetingInput, 'christianLife' | 'fieldMinistry'>, MeetingTasks][] = [
			['chairmanId', CHAIRMAN],
			['treasuresTalkerId', TREASURES_SPEAKER],
			['spiritualGemsDirectorId', SPIRITUAL_GEMS_DIRECTOR],
			['bookStudyDirectorId', BOOK_STUDY_DIRECTOR],
			['bookStudyReaderId', BOOK_STUDY_READER],
		];

		meetingTasks.forEach(([key, taskTitle]) => {
			const volunteerId = meeting[key];
			if (!volunteerId || typeof volunteerId != 'number') return;

			const hasPermission = !!this.permissionRepository!.findByVolunteerIdAndTaskTitle({
				volunteerId,
				taskTitle,
			});

			if (!hasPermission) permissionMapper.set(key, { volunteerId, taskTitle });
		});

		meeting.christianLife?.forEach((item, i) => {
			const { directorId } = item;
			if (typeof directorId !== 'number') return;

			const hasPermission = !!this.permissionRepository!.findByVolunteerIdAndTaskTitle({
				volunteerId: directorId,
				taskTitle: CHRISTIAN_LIFE,
			});

			if (!hasPermission)
				permissionMapper.set(`christianLife[${i}].directorId`, {
					volunteerId: directorId,
					taskTitle: CHRISTIAN_LIFE,
				});
		});

		return [...permissionMapper.values()].map(({ volunteerId, taskTitle }) => {
			const volunteer = this.volunteerRepository!.getById(volunteerId) as { name: string };
			if (!volunteer.name) return `Voluntário não encontrado para a designação ${taskTitle}`;

			return `${volunteer.name} não tem permissão a designação ${taskTitle}`;
		});
	}
}
