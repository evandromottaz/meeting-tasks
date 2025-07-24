import {z} from 'zod'
import { MESSAGES } from './messages';

export const schema = z.object({
	titulo: z.string().trim().min(1, MESSAGES.INVALID_TITULO),
});