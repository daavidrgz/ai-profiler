import { z } from 'zod';

export const ProfilingDataDtoSchema = z
	.object({
		algorithm: z.string(), time: z.number(), output: z.array(z.object(
			{
				id: z.number(),
				result: z.object(
					{
						gender: z.string(),
						birthyear: z.string(),
						fame: z.string(),
						occupation: z.string(),
					})
			}
		))
	})

type ProfilingDataDto = z.infer<typeof ProfilingDataDtoSchema>;
export default ProfilingDataDto;
