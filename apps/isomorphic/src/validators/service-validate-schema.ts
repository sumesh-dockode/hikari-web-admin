import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// form zod validation schema
export const serviceValidateSchema = z.object({
  productname: z.string().min(1, { message: messages.bookingNameIsRequired }),
  requestedby: z.string().min(1, { message: messages.bookingNameIsRequired }),
  images: z.array(fileSchema).optional(),
});

// generate form types from zod validation schema
export type ServiceDetailsInput = z.infer<typeof serviceValidateSchema>;
