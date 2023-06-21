import { z } from 'zod';
import { PersonSchema } from './person';

export const ProfilingDataSchema = z
	.object({
		algorithm: z.string(),
		time: z.number(),
		people: z.array(PersonSchema)
	})

export type ProfilingData = z.infer<typeof ProfilingDataSchema>;
