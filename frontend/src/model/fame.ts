import { z } from 'zod';

export const FameSchema = z.enum(["rising", "star", "superstar"]);

export type Fame = z.infer<typeof FameSchema>;
