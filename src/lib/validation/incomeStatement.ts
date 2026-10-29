import { z } from 'zod';

export const isFilterSchema = z
  .object({
    reportType: z.enum(['Comprehensive', 'Summary']),
    compareTo: z.enum(['Previous Period', 'Company', 'Cost Center', 'Budget']),
    dateRange: z.string().min(1),
    noOfPeriod: z.number().int().min(1).max(10),
    displayedBy: z.enum(['Month', 'Quarter', 'Year']),
    showInPercent: z.boolean(),
    valueShowIn: z.enum(['N/A', 'Absolute', 'Percent', 'Ratio']),
    currency: z.enum(['BDT', 'USD', 'EUR', 'GBP', 'INR']),
    selectedCompanies: z.array(z.string()),
    selectedCostCenters: z.array(z.string()),
    advancedFilterCollapsed: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.compareTo === 'Company' && val.selectedCompanies.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select at least one company',
        path: ['selectedCompanies'],
      });
    }
    if (val.compareTo === 'Cost Center' && val.selectedCostCenters.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select at least one cost center',
        path: ['selectedCostCenters'],
      });
    }
  });

export type ISFilterSchemaType = z.infer<typeof isFilterSchema>;
