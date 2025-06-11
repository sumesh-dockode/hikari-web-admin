import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';
import { iconsData } from '@core/data/icons-data';

// form zod validation schema
export const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: messages.catNameIsRequired }),
  parent: z.string().optional(),
  image: z.array(fileSchema).optional(),
  icon_image: z.array(fileSchema).optional(),
  // is_deleted : z.boolean().optional(),
});
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
