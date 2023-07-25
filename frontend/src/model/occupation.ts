import { z } from 'zod';

export const OccupationSchema = z.enum(["professional", "performer", "science", "politics", "manager",
	"creator", "sports", "religious"]);

export type Occupation = z.infer<typeof OccupationSchema>;
