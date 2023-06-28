import { z } from 'zod';

export const OccupationSchema = z.enum(["sports", "performer", "creator", "politics", "manager",
	"science", "professional", "religious"]);

export type Occupation = z.infer<typeof OccupationSchema>;
