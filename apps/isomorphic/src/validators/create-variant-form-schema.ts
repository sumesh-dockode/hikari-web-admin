import { messages } from '@/config/messages';
import { z } from 'zod';

export const variantSchema = z.object({
  variants: z
    .array(
      z.object({
        variantId: z.string().min(1,  { message: messages.  variantNameIsRequired,
        }),
        valueId: z.string().min(1, { message: messages.variantValueIsRequired }),
      })
    )
    .min(1, { message: messages.variantatleastOneIsRequired })
    .refine((items) => {
      const combos = new Set();
      const names = new Set();
      for (const item of items) {
        const comboKey = `${item.variantId}-${item.valueId}`;
        if (combos.has(comboKey)) return false;
        combos.add(comboKey);

        if (names.has(item.variantId)) return false;
        names.add(item.variantId);
      }
      return true;
    }, 'Duplicate variants or values are not allowed'),
    value: z.string().min(1, { message: messages.variantValueIsRequired }),

  price: z
    .string()
    .min(1, { message: messages.priceIsRequired })
    .refine((val) => !isNaN(Number(val)), 'Price must be a number'),
  sku: z.string().min(1, { message: messages.variantSkuIsRequired }),
  stock: z
    .string()
    .min(1, { message: messages.variantStockIsRequired })
});

export type VariantFormInput = z.infer<typeof variantSchema>;
