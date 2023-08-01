import { z } from 'zod';
import { PersonSchema } from './person';
import { ProfilingAlgorithmSchema } from './profilingAlgorithm';

export const ProfilingSchema = z
	.object({
		id: z.string(),
		algorithm: ProfilingAlgorithmSchema,
		time: z.number(),
		people: z.array(PersonSchema)
	})

export type Profiling = z.infer<typeof ProfilingSchema>;
