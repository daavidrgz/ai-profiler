import { z } from 'zod';
import { GenderSchema } from './gender';
import { ProfilingData } from './profilingData';
import { ProfilingAlgorithmSchema } from './algorithm';

export const ProfilingDataDtoSchema = z
	.object({
		status: z.string(),
		profiling: z.object({
			algorithm: ProfilingAlgorithmSchema,
			time: z.number(),
			output: z.array(z.object(
				{
					id: z.number(),
					result: z.object(
						{
							gender: GenderSchema,
							birthyear: z.string(),
							fame: z.string(),
							occupation: z.string(),
						})
				}
			))
		}).optional()
	})

export type ProfilingDataDto = z.infer<typeof ProfilingDataDtoSchema>;

export const toProfilingData = (dto: ProfilingDataDto): ProfilingData => {
	return {
		algorithm: dto.profiling!.algorithm,
		time: dto.profiling!.time,
		people: dto.profiling!.output.map((person) => {
			return {
				name: person.id.toString(),
				birthDecade: decadeToNumber(person.result.birthyear),
				gender: person.result.gender,
			}
		})
	}
}

const decadeToNumber = (birthyear: string): number => {
	const birthyearString = birthyear.substring(0, birthyear.length - 1);
	return parseInt(birthyearString);
}
