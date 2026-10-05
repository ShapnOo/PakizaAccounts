import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string(),
  line1: z.string().min(1, 'Line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  isPrimary: z.boolean(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  mimeType: z.string(),
  dataUrl: z.string(),
});

export const customerSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(120, 'Customer name cannot exceed 120 characters'),
  shortName: z
    .string()
    .min(2, 'Short name must be at least 2 characters')
    .max(8, 'Short name must be at most 8 characters')
    .regex(/^[A-Z0-9]+$/, 'Uppercase letters and digits only'),
  groupId: z.string().min(1, 'Please select a customer group'),
  customerType: z.enum([
    'General',
    'Retail',
    'Wholesale',
    'Corporate',
    'Government',
  ]),
  country: z.string().min(1, 'Please select a country/region'),
  paymentType: z.enum(['Credit', 'Cash', 'Advance', 'LC', 'Others']),
  makeSupplierAlso: z.boolean(),
  addresses: z.array(addressSchema),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  bin: z
    .string()
    .regex(/^[\d-]{9,20}$/, 'BIN must be 9-20 digits')
    .optional()
    .or(z.literal('')),
  tin: z
    .string()
    .regex(/^[A-Z0-9-]{9,20}$/i, 'TIN must be 9-20 alphanumeric characters')
    .optional()
    .or(z.literal('')),
  keyPerson: z.string().max(80, 'Key person max 80 characters').optional().or(z.literal('')),
  mobile: z.string().max(25, 'Mobile max 25 characters').optional().or(z.literal('')),
  note: z.string().max(500, 'Note cannot exceed 500 characters').optional().or(z.literal('')),
  accountsReceivableId: z.string().nullable().optional(),
  advanceReceiveAccountId: z.string().nullable().optional(),
  attachments: z.array(attachmentSchema).max(5, 'Maximum 5 attachments allowed'),
  effectiveCompanyId: z.string().min(1, 'Company ID is required'),
  activeStatus: z.enum(['Active', 'Inactive']),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
