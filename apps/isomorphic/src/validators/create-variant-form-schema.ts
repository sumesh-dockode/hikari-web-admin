import { messages } from '@/config/messages';
import { z } from 'zod';

export const variantSchema = z.object({
  variants: z.array(
    z.object({
      variantId: z.string().min(1, { message: messages.variantNameIsRequired }),
      valueId: z.string().min(1, { message: messages.variantValueIsRequired }),
    })
  ).min(1, {message:messages.variantNameIsRequired}),
  price: z
    .number()
    .min(1, { message: messages.variantpriceIsRequired })
    .refine((val) => !isNaN(Number(val)), 'Price must be a number'),
  sku: z.string().min(1, { message: messages.variantSkuIsRequired }),
  stock: z
    .number()
    .min(1, { message: messages.variantStockIsRequired })
});

export type VariantFormInput = z.infer<typeof variantSchema>;
