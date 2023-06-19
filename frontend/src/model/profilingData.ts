import { z } from 'zod';
import ProfilingDataDto from './profilingDataDto';
import { PersonSchema } from './person';

export const ProfilingDataSchema = z
	.object({
		algorithm: z.string(),
		time: z.number(),
		people: z.array(PersonSchema)
	})

type ProfilingData = z.infer<typeof ProfilingDataSchema>;
export default ProfilingData;
