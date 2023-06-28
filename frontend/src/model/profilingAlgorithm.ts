import { z } from 'zod';

export const ProfilingAlgorithmSchema = z.enum(["martinc", "grivas"]);

export type ProfilingAlgorithm = z.infer<typeof ProfilingAlgorithmSchema>;
