import { messages } from '@/config/messages';
import { z } from 'zod';

const imageSchema = z.object({
  id: z.string().optional(),
  image: z.string(),
  product_variant: z.string().optional(),
});

export const variantSchema = z
  .object({
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
    actual_price: z.number().min(0, 'Default price is required'),
    price: z.number().optional(),
    offer_price: z
      .number({ invalid_type_error: 'Offer Price must be a number' })
      .min(0, { message: 'Offer Price must be 0 or greater' })
      .optional(),
    sku: z.string().min(1, { message: messages.variantSkuIsRequired }),
    stock: z.number().min(1, { message: messages.variantStockIsRequired }),
    incentive_type: z
      .string({ required_error: 'Incentive type is required' })
      .min(1, { message: messages.variantIncentiveType }),
    incentive_value: z
      .number()
      .min(0, { message: messages.variantIncentiveValue })
      .refine((val) => !isNaN(Number(val)), 'Incentive value must be a number'),
    images: z.array(imageSchema).optional(),
    is_primary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate if price is set
    if (
      typeof data.price === 'number' &&
      typeof data.actual_price === 'number' &&
      data.price >= data.actual_price
    ) {
      ctx.addIssue({
        path: ['price'],
        code: z.ZodIssueCode.custom,
        message: 'Offer price must be less than default price',
      });
    }
  });

export type VariantFormInput = z.infer<typeof variantSchema>;
