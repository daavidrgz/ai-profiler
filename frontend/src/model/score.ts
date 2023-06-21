import { z } from 'zod';

export const ScoreSchema = z.object({
	birthDecade: z.number(),
	gender: z.number(),
})

export type Score = z.infer<typeof ScoreSchema>
