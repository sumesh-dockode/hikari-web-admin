import { z } from 'zod';
import { fileSchema } from './common-rules';

// form zod validation schema
export const promotionFormSchema = z.object({
  images: z.array(fileSchema).optional(),
});

export type PromotionFormInput = z.infer<typeof promotionFormSchema>;
