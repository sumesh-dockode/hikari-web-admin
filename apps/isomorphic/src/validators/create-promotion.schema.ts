import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

export const promotionFormSchema = z.object({
  store_manager: z.number(),
  product: z.string().min(1, { message: messages.catNameIsRequired }),
  promotion_medium: z.string().min(1, { message: messages.catNameIsRequired }),
  comments: z.string().min(1, { message: messages.catNameIsRequired }),
  aspect_ratio: z.string().min(1, { message: messages.catNameIsRequired }),
  area_latitude: z.string().min(1, { message: messages.catNameIsRequired }),
  area_longitude: z.string().min(1, { message: messages.catNameIsRequired }),
  promotion_image: fileSchema, // required
  promotion_document: fileSchema, // required
});

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
