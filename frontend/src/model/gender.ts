import { z } from 'zod';

export const GenderSchema = z.enum(["male", "female", "nonbinary"]);

export type Gender = z.infer<typeof GenderSchema>;
