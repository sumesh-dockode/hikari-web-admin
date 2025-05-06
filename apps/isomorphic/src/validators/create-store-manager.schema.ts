import { z } from 'zod';
import { messages } from '@/config/messages';
import {
  fileSchema,
  validateEmail,
  validateNewPassword,
  validateUserName,
} from './common-rules';

// form zod validation schema
export const storeManagerFormSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, { message: messages.firstNameRequired }),
  last_name: z.string().optional(),
  email: validateEmail,
  store_name: z.string().min(1, { message: messages.storeNameRequired }),
  store_address: z.string().min(1, { message: messages.storeAddressRequired }),
  username: validateUserName,
  password: validateNewPassword,
  images: fileSchema.optional(),
  is_active: z.boolean().optional(),
});

// generate form types from zod validation schema
export type StoreManagerFormInput = z.infer<typeof storeManagerFormSchema>;
