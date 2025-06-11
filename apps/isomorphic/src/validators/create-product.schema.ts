import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';
import next from 'next';

export const productFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: messages.productNameIsRequired }),
  sku: z.string().min(1, { message: messages.productSkuIsRequired }),
  category: z.string().min(1, { message: messages.catNameIsRequired }),
  description: z.string().min(1, { message: messages.descriptionIsRequired }),
  // images: z.array(fileSchema).optional(),
  price: z
    .string()
    .min(1, { message: messages.variantpriceIsRequired }),
    stock: z
    .number()
    .min(1, { message: messages.variantStockIsRequired }),
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
 
});

export type CreateProductInput = z.infer<typeof productFormSchema>;
