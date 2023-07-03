import { z } from 'zod';
import { GenderSchema } from './gender';
import { ProfilingData } from './profilingData';
import { ProfilingAlgorithmSchema } from './profilingAlgorithm';
import { AgeSchema } from './age';
import { FameSchema } from './fame';
import { OccupationSchema } from './occupation';

export const ProfilingDataDtoSchema = z
	.object({
		status: z.string(),
		profiling: z.object({
			algorithm: ProfilingAlgorithmSchema,
			time: z.number(),
			output: z.array(z.object(
				{
					id: z.string(),
					result: z.object(
						{
							gender: GenderSchema,
							age: AgeSchema,
							fame: FameSchema.optional(),
							occupation: OccupationSchema.optional(),
							extroverted: z.number().optional(),
							stable: z.number().optional(),
							agreeable: z.number().optional(),
							conscientious: z.number().optional(),
							open: z.number().optional(),
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
				age: person.result.age,
				gender: person.result.gender,
				fame: person.result.fame,
				occupation: person.result.occupation,
				personalityTraits: dto.profiling!.algorithm === "grivas" ? [
					{ trait: "extroverted", weight: person.result.extroverted! },
					{ trait: "stable", weight: person.result.stable! },
					{ trait: "agreeable", weight: person.result.agreeable! },
					{ trait: "conscientious", weight: person.result.conscientious! },
					{ trait: "open", weight: person.result.open! },
				] : undefined
			}
		})
	}
}
