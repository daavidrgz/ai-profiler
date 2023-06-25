import { z } from 'zod';

export const ProfilingAlgorithmSchema = z.enum(["martinc_celebrity"]);

export type ProfilingAlgorithm = z.infer<typeof ProfilingAlgorithmSchema>;
