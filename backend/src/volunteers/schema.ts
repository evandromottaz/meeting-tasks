import {z} from 'zod'
import { MESSAGES } from './messages';

export const schema = z.object({
	name: z.string().trim().min(1, MESSAGES.INVALID_NOME),
});