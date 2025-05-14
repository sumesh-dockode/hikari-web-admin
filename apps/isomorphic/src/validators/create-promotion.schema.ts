import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

export const promotionFormSchema = z.object({
  id: z.string().optional(),
  store_manager: z.number(),
  product: z.string().min(1, { message: messages.catNameIsRequired }),
  promotion_medium: z.string().min(1, { message: messages.catNameIsRequired }),
  comments: z.string().min(1, { message: messages.catNameIsRequired }),
  aspect_ratio: z.string().min(1, { message: messages.catNameIsRequired }),
  area_latitude: z.string().min(1, { message: messages.catNameIsRequired }),
  area_longitude: z.string().min(1, { message: messages.catNameIsRequired }),
  promotion_image: z.array(fileSchema),
  promotion_document: z.array(fileSchema).optional(),
});

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
