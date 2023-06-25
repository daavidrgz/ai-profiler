import { z } from 'zod';
import { PersonSchema } from './person';
import { ProfilingAlgorithmSchema } from './algorithm';

export const ProfilingDataSchema = z
	.object({
		algorithm: ProfilingAlgorithmSchema,
		time: z.number(),
		people: z.array(PersonSchema)
	})

export type ProfilingData = z.infer<typeof ProfilingDataSchema>;
