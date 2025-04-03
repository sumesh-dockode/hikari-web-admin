import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';
import next from 'next';

export const productFormSchema = z.object({
  title: z.string().min(1, { message: messages.productNameIsRequired }),
  sku: z.string().optional(),
  categoryName: z.string().min(1, { message: messages.catNameIsRequired }),
  description: z.string().optional(),
  productImages: z.array(fileSchema).optional(),
  price: z.coerce.number().min(1, { message: messages.priceIsRequired }),
  customFields: z
    .array(
      z.object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),

  nextDayShipping: z.boolean().optional(),
  productVariants: z
    .array(
      z.object({
        name: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateProductInput = z.infer<typeof productFormSchema>;
