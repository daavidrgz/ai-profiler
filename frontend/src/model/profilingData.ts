import { z } from 'zod';
import { PersonSchema } from './person';
import { ProfilingAlgorithmSchema } from './profilingAlgorithm';

export const ProfilingDataSchema = z
	.object({
		id: z.string(),
		algorithm: ProfilingAlgorithmSchema,
		time: z.number(),
		people: z.array(PersonSchema)
	})

export type ProfilingData = z.infer<typeof ProfilingDataSchema>;
