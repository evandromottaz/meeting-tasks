import { z } from 'zod';
import { MESSAGES } from './messages';

export const schema = z.object({
	data: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, MESSAGES.INVALID_DATA),
	papelId: z
		.number({ error: '"papelId" precisa ser um número.' })
		.int()
		.positive({ error: '"papelId" precisa ser maior que 0."' }),
	usuarioId: z
		.number({ error: '"usuarioId" precisa ser um número.' })
		.int()
		.positive({ error: '"usuarioId" precisa ser maior que 0."' }),
});
