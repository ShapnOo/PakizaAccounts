import { z } from 'zod';

export const lineSchema = z
  .object({
    id: z.string(),
    accountHeadId: z.string().min(1, 'Account is required'),
    costCenterId: z.string().optional(),
    subsidiaryId: z.string().optional(),
    employeeId: z.string().optional(),
    vehicleId: z.string().optional(),
    reference: z.string().max(80, 'Reference cannot exceed 80 chars').optional(),
    description: z.string().max(160, 'Description cannot exceed 160 chars').optional(),
    currency: z.string().min(1, 'Currency is required'),
    exchangeRate: z.number().positive('Rate must be > 0'),
    debit: z.number().nonnegative().optional(),
    credit: z.number().nonnegative().optional(),
    debitBDT: z.number().nonnegative().optional(),
    creditBDT: z.number().nonnegative().optional(),
  })
  .refine(
    (l) => (l.debitBDT ?? 0) > 0 || (l.creditBDT ?? 0) > 0,
    { message: 'Enter a Debit or Credit amount' }
  )
  .refine(
    (l) => !((l.debitBDT ?? 0) > 0 && (l.creditBDT ?? 0) > 0),
    { message: 'Use only Debit or Credit, not both' }
  );

export const openingBalanceSchema = z
  .object({
    openingDate: z.string().min(1, 'Opening date is required'),
    lines: z.array(lineSchema).min(2, 'Add at least two lines'),
    note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
  })
  .refine(
    (d) => {
      const dSum = d.lines.reduce((s, l) => s + (l.debitBDT ?? 0), 0);
      const cSum = d.lines.reduce((s, l) => s + (l.creditBDT ?? 0), 0);
      return Math.abs(dSum - cSum) < 0.01;
    },
    { message: 'Total Debit (BDT) must equal Total Credit (BDT)' }
  );

export type ValidatedOpeningBalance = z.infer<typeof openingBalanceSchema>;
export type ValidatedOpeningBalanceLine = z.infer<typeof lineSchema>;
