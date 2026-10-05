import { z } from 'zod';

export const defaultAccountRowSchema = z.object({
  id: z.string(),
  accountId: z.string().min(1, 'Please select an account'),
  accountName: z.string().optional(),
  nature: z.enum(['DR', 'CR', '']),
  companyId: z.string().min(1, 'Company is required'),
  active: z.boolean(),
});

export const voucherDefinitionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Voucher Name must be at least 3 characters')
    .max(60, 'Voucher Name cannot exceed 60 characters'),
  shortName: z
    .string()
    .trim()
    .min(2, 'Short Name must be at least 2 characters')
    .max(6, 'Short Name cannot exceed 6 characters'),
  voucherType: z.enum([
    'Journal Voucher',
    'Payment Voucher',
    'Receive Voucher',
    'Contra Voucher',
  ]),
  activeStatus: z.enum(['Active', 'Inactive']),
  defaultAccounts: z.array(defaultAccountRowSchema).default([]),
});

export type VoucherDefinitionFormValues = z.infer<typeof voucherDefinitionSchema>;

export const voucherLineSchema = z.object({
  id: z.string(),
  accountHeadId: z.string().min(1, 'Account Head is required'),
  costCenterId: z.string().optional(),
  subsidiaryId: z.string().optional(),
  employeeId: z.string().optional(),
  vehicleId: z.string().optional(),
  reference: z.string().optional(),
  description: z.string().optional(),
  currency: z.string().default('BDT'),
  exchangeRate: z.number().min(0.0001, 'Exchange rate must be positive').default(1),
  debit: z.number().min(0).optional(),
  credit: z.number().min(0).optional(),
});

export const voucherEntrySchema = z
  .object({
    voucherType: z.enum([
      'Journal Voucher',
      'Payment Voucher',
      'Receive Voucher',
      'Contra Voucher',
    ]),
    date: z.string().min(1, 'Voucher date is required'),
    headerAccountId: z.string().optional(),
    headerCostCenterId: z.string().optional(),
    lines: z.array(voucherLineSchema).min(1, 'At least one line item is required'),
    narration: z.string().max(500, 'Narration cannot exceed 500 characters').optional(),
  })
  .superRefine((data, ctx) => {
    // If Payment or Receive, headerAccountId is required
    if (
      (data.voucherType === 'Payment Voucher' || data.voucherType === 'Receive Voucher') &&
      (!data.headerAccountId || data.headerAccountId.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['headerAccountId'],
        message: `${
          data.voucherType === 'Payment Voucher' ? 'Payment' : 'Receive'
        } Account is required`,
      });
    }

    // Payment voucher: at least one Debit line with amount > 0
    if (data.voucherType === 'Payment Voucher') {
      const hasDebit = data.lines.some((l) => (l.debit || 0) > 0);
      if (!hasDebit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lines'],
          message: 'Payment Voucher requires at least one Debit amount greater than 0',
        });
      }
    }

    // Receive voucher: at least one Credit line with amount > 0
    if (data.voucherType === 'Receive Voucher') {
      const hasCredit = data.lines.some((l) => (l.credit || 0) > 0);
      if (!hasCredit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lines'],
          message: 'Receive Voucher requires at least one Credit amount greater than 0',
        });
      }
    }
  });

export type VoucherEntryFormValues = z.infer<typeof voucherEntrySchema>;
