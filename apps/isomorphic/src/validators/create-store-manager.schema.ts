import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// form zod validation schema
export const storeManagerFormSchema = z.object({
  name: z.string().min(1, { message: messages.catNameIsRequired }),
  images: z.array(fileSchema).optional(),
});

// generate form types from zod validation schema
export type StoreManagerFormInput = z.infer<typeof storeManagerFormSchema>;
