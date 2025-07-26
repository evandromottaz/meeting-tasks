import { MEETING_MESSAGES } from '@/shared/const';
import { z } from 'zod';

export const schema = z.object({
	date: z
		.string(MEETING_MESSAGES.DATE_INVALID_FORMAT)
		.regex(/^\d{4}-\d{2}-\d{2}$/, MEETING_MESSAGES.DATE_INVALID_FORMAT),
	taskId: z.number({ error: MEETING_MESSAGES.TASK_ID_INVALID }).int().positive(),
	volunteerId: z.number({ error: MEETING_MESSAGES.VOLUNTEER_ID_INVALID }).int().positive(),
});

export const updateSchema = schema.extend({
	date: schema.shape.date.optional(),
});
