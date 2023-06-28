import { OccupationSchema } from './occupation';
import z from 'zod';
import { GenderSchema } from './gender';
import { AgeSchema } from './age';
import { FameSchema } from './fame';

export const PersonSchema = z
	.object({
		name: z.string(),
		age: AgeSchema,
		gender: GenderSchema,
		fame: FameSchema.optional(),
		occupation: OccupationSchema.optional(),
	})

export type Person = z.infer<typeof PersonSchema>;
