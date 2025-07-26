import { z } from 'zod';

export const schema = z.object({
	title: z.string().trim().min(1),
});
