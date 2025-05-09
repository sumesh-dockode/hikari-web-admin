import { z } from 'zod';
export const variantSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
  });
export type ProductVariantFormInput = z.infer<typeof variantSchema>;

export const variantValueSchema = z.object({
  value: z.string(),
});
export type ProductVariantValueFormInput = z.infer<typeof variantValueSchema>;