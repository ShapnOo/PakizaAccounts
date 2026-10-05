import { z } from 'zod';

export const currencySetupSchema = z.object({
  code: z
    .string()
    .min(3, 'Must be 3 letters')
    .max(3, 'Must be 3 letters')
    .regex(/^[A-Z]{3}$/, 'Must be an ISO 4217 uppercase 3-letter code'),
  country: z.string().min(1, 'Country is required'),
  displayCode: z.string().min(1, 'Display code is required'),
  name: z.string().min(1, 'Currency name is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  decimalPlace: z.number().int().min(0).max(4, 'Decimal places must be between 0 and 4'),
  subunit: z.string().min(1, 'Subunit is required'),
  commaFormat: z.enum([
    '12,34,56,789',
    '1,234,567,890',
    '1.234.567.890',
    '12 34 56 789',
    '123456789',
  ]),
});

export const rateSchema = z.object({
  rate: z.number().positive('Rate must be greater than 0'),
  effectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be valid date format (YYYY-MM-DD)'),
});

export type ValidatedCurrencySetup = z.infer<typeof currencySetupSchema>;
export type ValidatedRate = z.infer<typeof rateSchema>;
