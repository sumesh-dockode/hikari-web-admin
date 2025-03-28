import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema, validateEmail, validateNewPassword } from './common-rules';

// form zod validation schema
export const salesmanFormSchema = z.object({
  first_name: z.string().min(1, { message: messages.firstNameRequired }),
  last_name: z.string().optional(),
  email: validateEmail,
  role: z.string().optional(),
  username: z.string().min(3),
  password: validateNewPassword,
  images: fileSchema.optional(),
  is_active: z.boolean().optional(),
});

// generate form types from zod validation schema
export type SalesmanFormInput = z.infer<typeof salesmanFormSchema>;
