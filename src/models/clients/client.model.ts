import { COMMON_SCHEMAS } from '@/utils/form-validation';
import { z } from 'zod';

export interface ClientFormData {
  companyName: string;
  contactPersonName?: string;
  email: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
}

export const createClientFormSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must be no more than 255 characters')
    .trim(),
  contactPersonName: z
    .string()
    .max(255, 'Contact person name must be no more than 255 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  email: COMMON_SCHEMAS.EMAIL.trim(),
  phone: z
    .string()
    .max(50, 'Phone number must be no more than 50 characters')
    .optional()
    .or(z.literal('')),
  streetAddress: z
    .string()
    .max(255, 'Street address must be no more than 255 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, 'City must be no more than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .max(100, 'State must be no more than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  zipCode: z
    .string()
    .max(20, 'ZIP code must be no more than 20 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .max(100, 'Country must be no more than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  taxId: z
    .string()
    .max(50, 'Tax ID must be no more than 50 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal('')),
});

export const updateClientFormSchema = createClientFormSchema.partial().extend({
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must be no more than 255 characters')
    .trim()
    .optional(),
  email: COMMON_SCHEMAS.EMAIL.trim().optional(),
});

export type CreateClientFormData = z.infer<typeof createClientFormSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientFormSchema>;

