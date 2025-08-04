import { Result } from '@/shared/types/result-pattern';
import { MeetingFieldMinistry } from './enums';

export type FieldMinistryInput = {
	title?: string;
	taskTitle: MeetingFieldMinistry;
	studentId: number;
	helperId?: number;
};

export type ChristianLifeInput = {
	directorId: number;
	title: string;
};

type MeetingInputComplete = {
	date: string;
	chairmanId: number;
	treasuresTalkerId: number;
	treasuresTalkerName?: string;
	treasuresTitle: string;
	spiritualGemsDirectorId: number;
	bookStudyDirectorId: number;
	bookStudyReaderId: number;
	fieldMinistry?: FieldMinistryInput[];
	christianLife?: ChristianLifeInput[];
};

export type MeetingInput = Partial<Omit<MeetingInputComplete, 'date'>> & { date: string };

type FieldMinistryOutput = {
	id: number;
	title: string | null;
	studentId: number;
	studentName: string;
	helperId: number | null;
	helperName: string | null;
};

type ChristianLifeOutput = {
	id: number;
	directorId: number;
	directorName: string;
	title: string;
};

export type MeetingOutput = {
	date: string;
	chairmanId: number;
	chairmanName: string;
	treasuresTalkerId: number;
	treasuresTalkerName: string;
	treasuresTitle: string;
	spiritualGemsDirectorId: number;
	spiritualGemsDirectorName: string;
	bookStudyDirectorId: number;
	bookStudyDirectorName: string;
	bookStudyReaderId: number;
	bookStudyReaderName: string;
	fieldMinistry: FieldMinistryOutput[];
	christianLife: ChristianLifeOutput[];
};

export interface IMeeting {
	create: (meeting: MeetingInput) => Result<MeetingOutput>;
}

export interface IMeetingRepository {
	create: (meeting: MeetingInput) => MeetingOutput;
	listAll: () => MeetingInput[];
}

export type Repositories = {
	readonly repository: IMeetingRepository;
	readonly permissionRepository?: {
		findByVolunteerIdAndTaskTitle: ({ taskTitle, volunteerId }: { taskTitle: string; volunteerId: number }) => unknown;
	};
	readonly volunteerRepository?: {
		getById: (id: number) => unknown;
	};
	readonly taskRepository?: {
		getById: (id: number) => unknown;
	};
};
