import { OccupationSchema } from './occupation';
import z from 'zod';
import { GenderSchema } from './gender';
import { AgeSchema } from './age';
import { FameSchema } from './fame';
import { PersonalityTraitSchema } from './personalityTrait';

export const PersonSchema = z
	.object({
		name: z.string(),
		age: AgeSchema,
		gender: GenderSchema,
		fame: FameSchema.optional(),
		occupation: OccupationSchema.optional(),
		personalityTraits: z.array(z.object({
			trait: PersonalityTraitSchema,
			weight: z.number().min(-0.5).max(0.5),
		})).optional(),
	})

export type Person = z.infer<typeof PersonSchema>;
