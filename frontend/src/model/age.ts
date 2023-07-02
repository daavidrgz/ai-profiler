import { z } from 'zod';

export const AgeSchema = z.enum(["XX-17", "18-24", "25-34", "35-49", "50-XX"]);

export type Age = z.infer<typeof AgeSchema>;
