import { z } from 'zod';

export const presetLineSchema = z.object({
  id: z.string(),
  accountHeadId: z.string().min(1, 'Account Head is required'),
  accountHeadName: z.string().optional(),
  costCenterId: z.string().optional(),
  subsidiaryId: z.string().optional(),
  employeeId: z.string().optional(),
  vehicleId: z.string().optional(),
  reference: z.string().max(80, 'Reference max 80 chars').optional(),
  description: z.string().max(160, 'Description max 160 chars').optional(),
  currency: z.string().min(1, 'Currency required').default('BDT'),
  exchangeRate: z.number().positive('Exchange rate must be positive').default(1),
  debit: z.number().nonnegative().optional(),
  credit: z.number().nonnegative().optional(),
  debitBDT: z.number().nonnegative().optional(),
  creditBDT: z.number().nonnegative().optional(),
});

export const presetFormSchema = z
  .object({
    profileName: z
      .string()
      .min(3, 'Profile name must be at least 3 characters')
      .max(60, 'Profile name cannot exceed 60 characters'),
    voucherType: z.enum(['Journal', 'Receive', 'Payment', 'Contra']),
    lines: z.array(presetLineSchema).min(1, 'At least one line item required'),
    narration: z.string().max(500, 'Narration cannot exceed 500 characters').optional(),
  })
  .superRefine((val, ctx) => {
    const minLines =
      val.voucherType === 'Journal' || val.voucherType === 'Contra' ? 2 : 1;

    if (val.lines.length < minLines) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `At least ${minLines} line items are required for ${val.voucherType} Voucher`,
        path: ['lines'],
      });
    }

    if (val.voucherType === 'Journal' || val.voucherType === 'Contra') {
      const sumDebit = val.lines.reduce((s, l) => s + (l.debitBDT ?? l.debit ?? 0), 0);
      const sumCredit = val.lines.reduce((s, l) => s + (l.creditBDT ?? l.credit ?? 0), 0);
      const diff = Math.abs(sumDebit - sumCredit);

      if (diff >= 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Total Debit (৳ ${sumDebit.toLocaleString()}) must equal Total Credit (৳ ${sumCredit.toLocaleString()})`,
          path: ['lines'],
        });
      }
    }

    if (val.voucherType === 'Payment') {
      const sumDebit = val.lines.reduce((s, l) => s + (l.debitBDT ?? l.debit ?? 0), 0);
      if (sumDebit <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Payment Voucher preset requires at least one Debit amount',
          path: ['lines'],
        });
      }
    }

    if (val.voucherType === 'Receive') {
      const sumCredit = val.lines.reduce((s, l) => s + (l.creditBDT ?? l.credit ?? 0), 0);
      if (sumCredit <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Receive Voucher preset requires at least one Credit amount',
          path: ['lines'],
        });
      }
    }
  });

export type PresetFormData = z.infer<typeof presetFormSchema>;
