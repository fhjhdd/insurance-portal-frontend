
import * as z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password:z.string(),
  referrerId: z.string().min(1, 'Referrer ID is required'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>;
