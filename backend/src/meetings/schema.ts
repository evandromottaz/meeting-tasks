import { MEETING_MESSAGES } from '@/shared/messages';
import { z } from 'zod';
import { MeetingFieldMinistry } from './enums';

const fieldMinistrySchema = z
	.object({
		taskTitle: z.string().min(1),
		title: z.string().optional(),
		studentId: z.number(),
		helperId: z.number().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.taskTitle !== MeetingFieldMinistry.BIBLE_READ && !data.title) {
			ctx.addIssue({
				code: 'custom',
				message: `"title" is required unless taskTitle is "${MeetingFieldMinistry.BIBLE_READ}"`,
				path: ['fieldMinistry', 'title'],
			});
		}
	});

export const schema = z
	.object({
		date: z
			.string(MEETING_MESSAGES.DATE_INVALID_FORMAT)
			.regex(/^\d{4}-\d{2}-\d{2}$/, MEETING_MESSAGES.DATE_INVALID_FORMAT),
		chairmanId: z.number({ error: MEETING_MESSAGES.CHAIRMAN_ID_INVALID }).int(),
		treasuresTalkerId: z.number({ error: MEETING_MESSAGES.TREASURES_TALKER_ID_INVALID }).int(),
		treasuresTitle: z.string().min(1, MEETING_MESSAGES.TREASURES_TITLE_REQUIRED),
		spiritualGemsDirectorId: z.number({ error: MEETING_MESSAGES.TREASURES_TALKER_ID_INVALID }).int(),
		bookStudyDirectorId: z.number({ error: MEETING_MESSAGES.BOOK_STUDY_DIRECTOR_ID_INVALID }).int(),
		bookStudyReaderId: z.number({ error: MEETING_MESSAGES.BOOK_STUDY_READER_ID_INVALID }).int(),
		fieldMinistry: z.array(fieldMinistrySchema),
		christianLife: z.array(z.object({ directorId: z.number(), title: z.string() })),
	})
	.partial()
	.extend({
		date: z
			.string(MEETING_MESSAGES.DATE_INVALID_FORMAT)
			.regex(/^\d{4}-\d{2}-\d{2}$/, MEETING_MESSAGES.DATE_INVALID_FORMAT),
	});
