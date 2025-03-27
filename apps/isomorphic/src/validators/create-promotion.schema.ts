import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// form zod validation schema
export const promotionFormSchema = z.object({
  productname: z.string().min(1, { message: messages.catNameIsRequired }),
  requestedby: z.string().min(1, { message: messages.catNameIsRequired }),
  promotionmedium: z.string().min(1, { message: messages.catNameIsRequired }),
  comments: z.string().min(1, { message: messages.catNameIsRequired }),
  aspectratio: z.string().min(1, { message: messages.catNameIsRequired }),
  area: z.string().min(1, { message: messages.catNameIsRequired }),
  images: z.array(fileSchema).optional(),
  document: z.array(fileSchema).optional(),
});

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
