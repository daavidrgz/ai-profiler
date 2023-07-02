import { z } from 'zod';

export const PersonalityTraitSchema = z.enum(["extroverted", "stable", "agreeable", "conscientious", "open"]);

export type PersonalityTrait = z.infer<typeof PersonalityTraitSchema>;
