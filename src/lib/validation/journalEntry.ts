import { z } from 'zod';

export const lineSchema = z.object({
  id: z.string(),
  accountHeadId: z.string().min(1, 'Account Head is required'),
  accountHeadName: z.string().optional(),
  costCenterId: z.string().optional(),
  subsidiaryId: z.string().optional(),
  employeeId: z.string().optional(),
  vehicleId: z.string().optional(),
  reference: z.string().max(80, 'Reference cannot exceed 80 chars').optional(),
  description: z.string().max(160, 'Description cannot exceed 160 chars').optional(),
  currency: z.string().min(1, 'Currency is required').default('BDT'),
  exchangeRate: z.number().positive('Exchange rate must be > 0').default(1),
  debit: z.number().nonnegative().optional(),
  credit: z.number().nonnegative().optional(),
  debitBDT: z.number().nonnegative().optional(),
  creditBDT: z.number().nonnegative().optional(),
});

export const entrySchema = z
  .object({
    voucherType: z.enum(['Journal', 'Receive', 'Payment', 'Contra']),
    voucherDate: z.string().min(1, 'Voucher Date is required'),
    narration: z.string().max(500, 'Narration cannot exceed 500 chars').optional(),
    headerAccountId: z.string().optional(),
    headerAccountName: z.string().optional(),
    headerCostCenterId: z.string().optional(),
    lines: z.array(lineSchema).min(1, 'At least one line item is required'),
  })
  .superRefine((val, ctx) => {
    const sumDebitBDT = val.lines.reduce((s, l) => s + (l.debitBDT ?? 0), 0);
    const sumCreditBDT = val.lines.reduce((s, l) => s + (l.creditBDT ?? 0), 0);

    // Double-entry validation for Journal and Contra
    if (val.voucherType === 'Journal' || val.voucherType === 'Contra') {
      if (val.lines.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least 2 line items are required for double-entry',
          path: ['lines'],
        });
      }

      if (Math.abs(sumDebitBDT - sumCreditBDT) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Debit (BDT ${sumDebitBDT.toLocaleString()}) must equal Credit (BDT ${sumCreditBDT.toLocaleString()}). Difference: BDT ${(sumDebitBDT - sumCreditBDT).toFixed(2)}`,
          path: ['lines'],
        });
      }

      if (sumDebitBDT <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Total voucher amount must be greater than zero',
          path: ['lines'],
        });
      }
    }

    // Payment validation (Single-sided debit)
    if (val.voucherType === 'Payment') {
      if (!val.headerAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Payment Header Account (Bank or Cash) is required',
          path: ['headerAccountId'],
        });
      }
      if (sumDebitBDT <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one Debit amount is required for Payment Voucher',
          path: ['lines'],
        });
      }
    }

    // Receive validation (Single-sided credit)
    if (val.voucherType === 'Receive') {
      if (!val.headerAccountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Receive Header Account (Bank or Cash) is required',
          path: ['headerAccountId'],
        });
      }
      if (sumCreditBDT <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one Credit amount is required for Receive Voucher',
          path: ['lines'],
        });
      }
    }
  });

export type EntryFormValues = z.infer<typeof entrySchema>;
