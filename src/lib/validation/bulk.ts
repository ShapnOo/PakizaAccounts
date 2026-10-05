import { z } from 'zod';

export const filterCriteriaSchema = z
  .object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    accountsName: z.string().optional(),
    amountMin: z.number().nonnegative().optional(),
    amountMax: z.number().nonnegative().optional(),
    costCenter: z.string().optional(),
    subsidy: z.string().optional(),
    employee: z.string().optional(),
    vehicle: z.string().optional(),
  })
  .refine(
    (d) => !d.amountMin || !d.amountMax || d.amountMin <= d.amountMax,
    {
      message: 'Min amount cannot exceed Max amount',
      path: ['amountMin'],
    }
  )
  .refine(
    (d) => !d.dateFrom || !d.dateTo || d.dateFrom <= d.dateTo,
    {
      message: 'From Date cannot be later than To Date',
      path: ['dateFrom'],
    }
  );

export const updateStepSchema = z.object({
  updateField: z.enum([
    'accountsHead',
    'costCenter',
    'subsidiary',
    'subsidy',
    'employee',
    'vehicle',
    'reference',
  ]),
  newValue: z.string().min(1, 'Update To value is required'),
});

export type FilterCriteriaFormData = z.infer<typeof filterCriteriaSchema>;
export type UpdateStepFormData = z.infer<typeof updateStepSchema>;
