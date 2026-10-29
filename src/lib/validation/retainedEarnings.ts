import { z } from 'zod';

export const reFilterSchema = z
  .object({
    dateRange: z.enum([
      'Today',
      'This Week',
      'This Month',
      'This Period',
      'This Quarter',
      'This Year',
      'Custom',
    ]),
    customFrom: z.string().optional(),
    customTo: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.dateRange === 'Custom') {
      if (!val.customFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'From date is required',
          path: ['customFrom'],
        });
      }
      if (!val.customTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'To date is required',
          path: ['customTo'],
        });
      }
      if (val.customFrom && val.customTo && val.customFrom > val.customTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'From date must be on or before To date',
          path: ['customFrom'],
        });
      }
    }
  });

