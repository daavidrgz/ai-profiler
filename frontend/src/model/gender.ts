import { z } from 'zod';

export const GenderSchema = z.enum(["male", "female"]);

export type Gender = z.infer<typeof GenderSchema>;
