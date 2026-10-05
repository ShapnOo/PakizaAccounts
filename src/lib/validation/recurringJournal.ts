import { z } from 'zod';

const lineSchema = z.object({
  id: z.string(),
  accountHeadId: z.string().min(1, 'Account Head is required'),
  accountHeadName: z.string().optional(),
  costCenterId: z.string().optional(),
  subsidiaryId: z.string().optional(),
  employeeId: z.string().optional(),
  vehicleId: z.string().optional(),
  reference: z.string().max(80).optional(),
  description: z.string().max(160).optional(),
  currency: z.string().min(1, 'Currency is required'),
  exchangeRate: z.number().positive('Exchange rate must be positive'),
  debit: z.number().nonnegative().optional(),
  credit: z.number().nonnegative().optional(),
  debitBDT: z.number().nonnegative().optional(),
  creditBDT: z.number().nonnegative().optional(),
});

export const recurringProfileSchema = z
  .object({
    profileName: z.string().min(3, 'Profile name must be at least 3 characters').max(60, 'Profile name must be at most 60 characters'),
    voucherType: z.enum(['Journal', 'Receive', 'Payment', 'Contra']),
    repeatEvery: z.enum(['Day', 'Week', 'Month', 'Quarter', 'Year']),
    startsOn: z.string().min(1, 'Start date is required'),
    endsOn: z.string().optional(),
    neverExpired: z.boolean(),
    lines: z.array(lineSchema).min(1, 'At least one line item is required'),
    narration: z.string().max(500, 'Narration must not exceed 500 characters').optional(),
  })
  .superRefine((val, ctx) => {
    // 1. Ends On required unless Never Expired
    if (!val.neverExpired) {
      if (!val.endsOn) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date is required when Never Expired is off',
          path: ['endsOn'],
        });
      } else if (val.endsOn <= val.startsOn) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date must be strictly after Start date',
          path: ['endsOn'],
        });
      }
    }

    // 2. Minimum line count per voucher type
    const minLines = val.voucherType === 'Journal' || val.voucherType === 'Contra' ? 2 : 1;
    if (val.lines.length < minLines) {
      ctx.addIssue({
        code: 'custom',
        message: `At least ${minLines} lines required for ${val.voucherType} profile`,
        path: ['lines'],
      });
    }

    // 3. Check debit/credit balances
    const sumD = val.lines.reduce((s, l) => s + (l.debitBDT ?? 0), 0);
    const sumC = val.lines.reduce((s, l) => s + (l.creditBDT ?? 0), 0);

    if (val.voucherType === 'Journal' || val.voucherType === 'Contra') {
      if (Math.abs(sumD - sumC) >= 0.01) {
        ctx.addIssue({
          code: 'custom',
          message: `Debit (৳ ${sumD.toFixed(2)}) must equal Credit (৳ ${sumC.toFixed(2)})`,
          path: ['lines'],
        });
      }
      if (sumD <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Total profile amount must be greater than zero',
          path: ['lines'],
        });
      }
    }

    if (val.voucherType === 'Payment' && sumD <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one Debit line is required for Payment profile',
        path: ['lines'],
      });
    }

    if (val.voucherType === 'Receive' && sumC <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one Credit line is required for Receive profile',
        path: ['lines'],
      });
    }
  });

export type RecurringProfileFormData = z.infer<typeof recurringProfileSchema>;
