import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// Define the allowed status values as a tuple of string literals
const allowedStatuses = [
  'offline',
  'pending',
  'paid',
  'completed',
  'cancelled',
  'service_started',
  'Booking_initiated',
  'confirm',
] as const; 

export const serviceValidateSchema = z.object({
  name: z.string().min(1, { message: messages.bookingNameIsRequired }),
  requesteduser: z.string().min(1, { message: messages.bookingNameIsRequired }),
  promocode: z.string().min(1, { message: messages.bookingNameIsRequired }),
  selectedservices: z.string().min(1, { message: messages.bookingNameIsRequired }),
  status: z
    .string()  // Start with ZodString
    .min(1, { message: messages.bookingNameIsRequired })  // Apply min validation first
    .refine((value) => allowedStatuses.includes(value), {
      message: 'Status must be one of the valid options: offline, pending, paid, etc.',
    }),
  images: z.array(fileSchema).optional(),
});

// generate form types from zod validation schema
export type ServiceDetailsInput = z.infer<typeof serviceValidateSchema>;
