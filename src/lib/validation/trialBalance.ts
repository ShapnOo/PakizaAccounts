import { z } from 'zod';

export const tbFilterSchema = z.object({
  currency: z.enum(['BDT', 'USD', 'EUR', 'GBP', 'INR']),
  dateRange: z.string().min(1),
  customFrom: z.string().optional(),
  customTo: z.string().optional(),
  valueShowIn: z.enum([
    'N/A',
    'Absolute',
    'Thousand(/1000)',
    'Million(/1000000)',
    'Percent',
    'Ratio',
  ]),
  glOnly: z.boolean(),
  subLedger: z.boolean(),
  visibleColumns: z
    .object({
      openingDr: z.boolean(),
      openingCr: z.boolean(),
      debit: z.boolean(),
      credit: z.boolean(),
      closingDr: z.boolean(),
      closingCr: z.boolean(),
    })
    .refine(
      (cols) => Object.values(cols).filter(Boolean).length >= 2,
      { message: 'At least 2 columns must be visible' }
    ),
  advancedFilterCollapsed: z.boolean(),
  expandAll: z.boolean(),
});

