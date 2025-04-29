import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';
import next from 'next';

export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: messages.productNameIsRequired }),
  sku: z.string().optional(),
  category: z.string().min(1, { message: messages.catNameIsRequired }),
  description: z.string().optional(),
  // images: z.array(fileSchema).optional(),
  price: z
    .number()
    .min(1, { message: messages.variantpriceIsRequired })
    .refine((val) => !isNaN(Number(val)), 'Price must be a number'),
  // customFields: z
  //   .array(
  //     z.object({
  //       label: z.string().optional(),
  //       value: z.string().optional(),
  //     })
  //   )
  //   .optional(),

  is_next_day_shipping_available: z.boolean().optional(),
  similar_products:z.array(z.string()).optional(),
  productVariants: z
    .array(
      z.object({
        name: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),
  slug: z.string().optional(),
  stock: z
     .number()
     .min(1, { message: messages.variantStockIsRequired })
});

export type CreateProductInput = z.infer<typeof productFormSchema>;
