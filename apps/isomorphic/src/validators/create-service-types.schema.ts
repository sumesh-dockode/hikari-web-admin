import { z } from 'zod';
import { messages } from '@/config/messages';

export const serviceTypesFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string().optional(),
  price: z.number().min(1, { message: messages.priceIsRequired }),
  duration: z.number().min(1, { message: 'Duration is required' }),
});

export type ServiceTypesFormInput = z.infer<typeof serviceTypesFormSchema>;
