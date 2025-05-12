import { z } from 'zod';
import { messages } from '@/config/messages';
import {
  fileSchema,
  validateEmail,
  validateNewPassword,
  validateUserName,
} from './common-rules';

export const getSalesmanFormSchema = (isEditMode: boolean) =>
  z.object({
    id: z.number().optional(),
    first_name: z.string().min(1, { message: messages.firstNameRequired }),
    last_name: z.string().optional(),
    email: validateEmail,
    phone_number: z
      .string()
      .min(1, { message: messages.phoneNumberIsRequired }),
    username: validateUserName,
    password: isEditMode ? z.string().optional() : validateNewPassword,
    is_active: z.boolean().optional(),
    store_manager_id: z
      .number({
        required_error: messages.storeManagerIsRequired,
        invalid_type_error: messages.storeManagerIsRequired,
      })
      .min(1, { message: messages.storeManagerIsRequired }),
  });

export type SalesmanFormInput = z.infer<
  ReturnType<typeof getSalesmanFormSchema>
>;
