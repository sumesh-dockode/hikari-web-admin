import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

export const promotionFormSchema = z.object({
  id: z.string().optional(),
  store_manager: z.string().optional(),
  product: z.string().optional(),
  product_name: z.string().optional(),
  promotion_medium: z.string().optional(),
  comments: z.string().optional(),
  aspect_ratio: z.string().optional(),
  // area_latitude: z.string().optional(),
  // area_longitude: z.string().optional(),
  location: z.string().optional(),
  promotion_image: z.array(fileSchema).min(1, {
    message: 'Promotion image is required',
  }),
  promotion_document: z.array(fileSchema).optional(),
});

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
