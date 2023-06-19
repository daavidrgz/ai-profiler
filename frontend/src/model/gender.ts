import { z } from 'zod';

export const GenderSchema = z.enum(["male", "female"]);

type Gender = z.infer<typeof GenderSchema>;
export default Gender;
