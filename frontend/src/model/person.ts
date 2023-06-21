import z from 'zod';
import { GenderSchema } from './gender';

export const PersonSchema = z
	.object({
		name: z.string(),
		birthDecade: z.number(),
		gender: GenderSchema
	})

export type Person = z.infer<typeof PersonSchema>;
