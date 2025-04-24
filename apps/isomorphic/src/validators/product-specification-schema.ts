import { z } from 'zod';
export const SpecificationSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
  });
export type ProductSpecificationFormInput = z.infer<typeof SpecificationSchema>;

export const SpecificationValueSchema = z.object({
  value: z.string(),
});
export type ProductSpecificationValueFormInput = z.infer<typeof SpecificationValueSchema>;