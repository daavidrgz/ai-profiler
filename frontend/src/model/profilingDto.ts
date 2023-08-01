import { z } from 'zod';
import { GenderSchema } from './gender';
import { Profiling } from './profiling';
import { ProfilingAlgorithmSchema } from './profilingAlgorithm';
import { AgeSchema } from './age';
import { FameSchema } from './fame';
import { OccupationSchema } from './occupation';

export const ProfilingDtoSchema = z
	.object({
		id: z.string(),
		status: z.enum(["PENDING", "SUCCESS"]),
		algorithm: ProfilingAlgorithmSchema,
		time: z.number().nullable(),
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
		)).nullable()
	})

export type ProfilingDto = z.infer<typeof ProfilingDtoSchema>;

export const toProfiling = (dto: ProfilingDto): Profiling => {
	return {
		id: dto.id,
		algorithm: dto.algorithm,
		time: dto.time!,
		people: dto.output!.map((person) => {
			return {
				name: person.id.toString(),
				age: person.result.age,
				gender: person.result.gender,
				fame: person.result.fame,
				occupation: person.result.occupation,
				personalityTraits: dto.algorithm === "grivas" ? [
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
