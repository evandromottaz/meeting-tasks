import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestApp } from './helpers/setup-test-app';
import type { App } from '@/index';
import { MEETING_MESSAGES } from '@/shared/messages';
import { MeetingFieldMinistry, MeetingTasks } from '@/features/meetings/enums';
import { ChristianLifeInput, FieldMinistryInput, MeetingInput, MeetingOutput } from '@/features/meetings/types';
import { Result } from '@/shared/types/result-pattern';

let app: App;

beforeEach(async () => {
	({ app } = setupTestApp());
});

const createVolunteer = (name: string) => request(app).post('/volunteers').send({ name });

const createTask = (title: string) => request(app).post('/tasks').send({ title });

const createPermission = (permission: { taskId: number; volunteerId: number }) =>
	request(app).post('/permissions').send(permission);

const createVolunteerWithTaskAndPermission = async (
	name: string,
	taskTitle: MeetingTasks
): Promise<{ id: number; taskId: number }> => {
	const volunteer = await createVolunteer(name);
	const task = await createTask(taskTitle);
	await createPermission({ taskId: task.body.id, volunteerId: volunteer.body.id });
	return { id: volunteer.body.id, taskId: task.body.id };
};

const createMeeting = (meeting: MeetingInput) => request(app).post('/meetings').send(meeting);

type ChristianLifeInputTest = {
	directorName: string;
	title: string;
};

const christianLifeLabels = [{ directorName: 'Rodrigues', title: 'Título parte Nossa Vida Cristã' }];

type FieldMinistryInputTest = {
	studentName: string;
	title?: string;
	helperName?: string;
};

const fieldMinistryLabels: FieldMinistryInputTest[] = [
	{ studentName: 'Teixeira' },
	{ studentName: 'Marli', helperName: 'Teresa', title: 'Primeira conversa' },
	{ studentName: 'Patrick', title: 'Título Discurso da Escola' },
];

type MeetingInputTest = Omit<MeetingInput, 'christianLife' | 'fieldMinistry'>;

type MeetingLabels = {
	date: string;
	chairmanName: string;
	treasuresTalkerName: string;
	treasuresTitle: string;
	spiritualGemsDirectorName: string;
	bookStudyDirectorName: string;
	bookStudyReaderName: string;
};

const meetingLabels: MeetingLabels = {
	date: '2050-08-01',
	chairmanName: 'Carlos',
	treasuresTalkerName: 'Roberto',
	treasuresTitle: 'Título da parte de tesouros',
	spiritualGemsDirectorName: 'Jorge',
	bookStudyDirectorName: 'Francisco',
	bookStudyReaderName: 'Afonso',
};

const setupFieldMinistryByLabels = async (
	fieldMinistry: FieldMinistryInputTest[]
): Promise<FieldMinistryInput[] | undefined> => {
	if (!Array.isArray(fieldMinistry)) return;

	const [bibleRead, demonstration, talk] = fieldMinistry;

	const [bibleReader, demoStudent, demoHelper, talker] = await Promise.all([
		createVolunteer(bibleRead.studentName),
		createVolunteer(demonstration.studentName!),
		createVolunteer(demonstration.helperName!),
		createVolunteer(talk.studentName),
	]);

	return [
		{ studentId: bibleReader.body.id, taskTitle: MeetingFieldMinistry.BIBLE_READ },
		{
			studentId: demoStudent.body.id,
			helperId: demoHelper.body.id,
			title: demonstration.title,
			taskTitle: MeetingFieldMinistry.DEMONSTRATION,
		},
		{
			studentId: talker.body.id,
			title: talk.title,
			taskTitle: MeetingFieldMinistry.TALK,
		},
	];
};

const setupChristianLifeByLabels = async (
	christianLife: ChristianLifeInputTest[]
): Promise<ChristianLifeInput[] | undefined> => {
	if (!Array.isArray(christianLife)) return;

	const [firstSession] = christianLife;

	const director = await createVolunteer(firstSession.directorName);
	const task = await createTask(MeetingTasks.CHRISTIAN_LIFE);
	await createPermission({ taskId: task.body.id, volunteerId: director.body.id });

	return [
		{
			directorId: director.body.id,
			title: christianLife[0].title,
		},
	];
};

const setupMeetingByLabels = async (props: MeetingLabels): Promise<MeetingInputTest> => {
	const chairman = await createVolunteerWithTaskAndPermission(meetingLabels.chairmanName, MeetingTasks.CHAIRMAN);
	const treasures = await createVolunteerWithTaskAndPermission(
		meetingLabels.treasuresTalkerName,
		MeetingTasks.TREASURES_SPEAKER
	);
	const spiritualGemsDirector = await createVolunteerWithTaskAndPermission(
		meetingLabels.spiritualGemsDirectorName,
		MeetingTasks.SPIRITUAL_GEMS_DIRECTOR
	);
	const bookStudyDirector = await createVolunteerWithTaskAndPermission(
		meetingLabels.bookStudyDirectorName,
		MeetingTasks.BOOK_STUDY_DIRECTOR
	);
	const bookStudyReader = await createVolunteerWithTaskAndPermission(
		meetingLabels.bookStudyReaderName,
		MeetingTasks.BOOK_STUDY_READER
	);

	return {
		date: props.date,
		chairmanId: chairman.id,
		treasuresTalkerId: treasures.id,
		treasuresTitle: props.treasuresTitle,
		spiritualGemsDirectorId: spiritualGemsDirector.id,
		bookStudyDirectorId: bookStudyDirector.id,
		bookStudyReaderId: bookStudyReader.id,
	};
};

const makeSut = async (
	props: MeetingInputTest & { fieldMinistry?: FieldMinistryInput[] } & { christianLife?: ChristianLifeInput[] }
): Promise<{ body: Result<MeetingOutput>; status: number }> => {
	const { fieldMinistry, christianLife, ...meting } = props;

	return await createMeeting({ ...meting, fieldMinistry, christianLife });
};

describe('Cadastra reunião', () => {
	describe('com sucesso', async () => {
		it('informando apenas a data', async () => {
			const { body } = await makeSut({ date: meetingLabels.date });
			expect(body).toMatchObject({
				ok: true,
				message: MEETING_MESSAGES.CREATED,
				data: {
					date: meetingLabels.date,
				},
			});
		});
		it('deve cadastrar uma reunião com todos os campos válidos', async () => {
			const fieldMinistry = await setupFieldMinistryByLabels(fieldMinistryLabels);
			const christianLife = await setupChristianLifeByLabels(christianLifeLabels);
			const meeting = await setupMeetingByLabels(meetingLabels);
			const { body } = await makeSut({ ...meeting, fieldMinistry, christianLife });

			const [bibleRead, demonstration, talk] = fieldMinistryLabels;
			const [firstChristianLife] = christianLifeLabels;

			expect(body).toStrictEqual({
				ok: true,
				message: MEETING_MESSAGES.CREATED,
				data: {
					...meetingLabels,
					chairmanId: expect.any(Number),
					treasuresTalkerId: expect.any(Number),
					spiritualGemsDirectorId: expect.any(Number),
					bookStudyDirectorId: expect.any(Number),
					bookStudyReaderId: expect.any(Number),
					fieldMinistry: [
						{
							...bibleRead,
							id: expect.any(Number),
							helperId: null,
							helperName: null,
							title: null,
							studentId: expect.any(Number),
						},
						{
							...demonstration,
							id: expect.any(Number),
							helperId: expect.toBeOneOf([expect.any(Number), null]),
							studentId: expect.any(Number),
						},
						{
							...talk,
							helperName: null,
							id: expect.any(Number),
							helperId: expect.toBeOneOf([expect.any(Number), null]),
							studentId: expect.any(Number),
						},
					],
					christianLife: [
						{
							...firstChristianLife,
							id: expect.any(Number),
							directorId: expect.toBeOneOf([expect.any(Number), null]),
						},
					],
				},
			});
		});
		it('deve cadastrar uma reunião apenas com dados obrigatórios', async () => {
			const meeting = await setupMeetingByLabels(meetingLabels);
			const { body } = await makeSut(meeting);

			expect(body).toMatchObject({
				ok: true,
				message: MEETING_MESSAGES.CREATED,
				data: expect.objectContaining({
					...meetingLabels,
					chairmanId: expect.any(Number),
					treasuresTalkerId: expect.any(Number),
					spiritualGemsDirectorId: expect.any(Number),
					bookStudyDirectorId: expect.any(Number),
					bookStudyReaderId: expect.any(Number),
					christianLife: [],
					fieldMinistry: [],
				}),
			});
		});
		it('deve cadastrar reunião com christianLife', async () => {
			const christianLife = await setupChristianLifeByLabels(christianLifeLabels);
			const meeting = await setupMeetingByLabels(meetingLabels);
			const { body } = await makeSut({ ...meeting, christianLife });

			expect(body).toMatchObject({
				ok: true,
				message: MEETING_MESSAGES.CREATED,
				data: {
					...meetingLabels,
					chairmanId: expect.any(Number),
					treasuresTalkerId: expect.any(Number),
					spiritualGemsDirectorId: expect.any(Number),
					bookStudyDirectorId: expect.any(Number),
					bookStudyReaderId: expect.any(Number),
					fieldMinistry: [],
					christianLife: [
						expect.objectContaining({
							...christianLifeLabels[0],
							id: expect.any(Number),
							directorId: expect.any(Number),
						}),
					],
				},
			});
		});
		it('deve cadastrar uma reunião com 2 fieldMinistry', async () => {
			const fieldMinistry = await setupFieldMinistryByLabels(fieldMinistryLabels);
			const meeting = await setupMeetingByLabels(meetingLabels);
			const { body } = await makeSut({ ...meeting, fieldMinistry: fieldMinistry?.slice(0, 2) });

			const [bibleRead, demonstration] = fieldMinistryLabels;

			expect(body).toMatchObject({
				ok: true,
				message: MEETING_MESSAGES.CREATED,
				data: {
					...meetingLabels,
					chairmanId: expect.any(Number),
					treasuresTalkerId: expect.any(Number),
					spiritualGemsDirectorId: expect.any(Number),
					bookStudyDirectorId: expect.any(Number),
					bookStudyReaderId: expect.any(Number),
					fieldMinistry: [
						{
							...bibleRead,
							id: expect.any(Number),
							helperId: null,
							helperName: null,
							title: null,
							studentId: expect.any(Number),
						},
						{
							...demonstration,
							id: expect.any(Number),
							helperId: expect.toBeOneOf([expect.any(Number), null]),
							studentId: expect.any(Number),
						},
					],
					christianLife: [],
				},
			});
		});
	});

	describe('com erro', () => {
		it('caso algum id de um voluntario não exista', async () => {
			const meeting = await setupMeetingByLabels(meetingLabels);
			const { body } = await makeSut({ ...meeting, chairmanId: 90 });

			expect(body).toMatchObject({
				ok: false,
				message: MEETING_MESSAGES.VOLUNTEER_NOT_FOUND,
				errors: ['ID 90 não está cadastrado.'],
			});
		});
		it('caso alguma tarefa não exista', async () => {
			const meeting = await setupMeetingByLabels(meetingLabels);
			const { body } = await makeSut({ ...meeting, chairmanId: 90 });

			expect(body).toMatchObject({
				ok: false,
				message: MEETING_MESSAGES.VOLUNTEER_NOT_FOUND,
				errors: ['ID 90 não está cadastrado.'],
			});
		});
	});
});
