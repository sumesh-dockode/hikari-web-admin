import { messages } from '@/config/messages';
import { z } from 'zod';

export const variantSchema = z.object({
  id: z.string().optional(),
  variants: z
    .array(
      z.object({
        variantId: z
          .string()
          .min(1, { message: messages.variantNameIsRequired }),
        valueId: z
          .string()
          .min(1, { message: messages.variantValueIsRequired }),
      })
    )
    .min(1, { message: messages.variantNameIsRequired }),
  price: z
    .number()
    .min(1, { message: messages.variantpriceIsRequired })
    .refine((val) => !isNaN(Number(val)), 'Price must be a number'),
  sku: z.string().min(1, { message: messages.variantSkuIsRequired }),
  stock: z.number().min(1, { message: messages.variantStockIsRequired }),
  incentive_type: z
    .string({ required_error: 'Incentive type is required' })
    .min(1, { message: messages.variantIncentiveType }),
  incentive_value: z
    .number()
    .min(1, { message: messages.variantIncentiveValue })
    .refine((val) => !isNaN(Number(val)), 'Incentive value must be a number'),
  images: z.array(z.string()).optional(),
});

export type VariantFormInput = z.infer<typeof variantSchema>;
