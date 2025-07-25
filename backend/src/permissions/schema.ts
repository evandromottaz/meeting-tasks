import { z } from 'zod';

export const schema = z.object({
	roleId: z
		.number({ error: '"roleId" precisa ser um número.' })
		.int()
		.positive({ error: '"roleId" precisa ser maior que 0."' }),
	volunteerId: z
		.number({ error: '"userId" precisa ser um número.' })
		.int()
		.positive({ error: '"userId" precisa ser maior que 0."' }),
});
