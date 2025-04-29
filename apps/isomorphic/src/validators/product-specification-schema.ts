import { z } from 'zod';
export const SpecificationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  product: z.string().min(1, "Product is required"),
  specification: z.string().min(1, 'Specification is required'),
  value: z.string().min(1, 'Value is required'),

  });
export type ProductSpecificationFormInput = z.infer<typeof SpecificationSchema>;

export const SpecificationValueSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  product: z.string().min(1, "Product is required"),
  specification: z.string().min(1, 'Specification is required'),

});
export type ProductSpecificationValueFormInput = z.infer<typeof SpecificationValueSchema>;