import { z } from 'zod';

// form zod validation schema
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});

// generate form types from zod validation schema
export type LoginSchema = z.infer<typeof loginSchema>;
