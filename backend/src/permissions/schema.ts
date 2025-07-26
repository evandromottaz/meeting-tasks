import { PERMISSION_MESSAGES } from '@/shared/const';
import { z } from 'zod';

export const schema = z.object({
	taskId: z.number({ error: PERMISSION_MESSAGES.TASK_ID_INVALID }).int().positive(),
	volunteerId: z.number({ error: PERMISSION_MESSAGES.VOLUNTEER_ID_INVALID }).int().positive(),
});
