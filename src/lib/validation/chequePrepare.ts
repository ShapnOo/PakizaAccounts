import { z } from 'zod';

export const prepareLineSchema = z.object({
  id: z.string(),
  chequeType: z.enum(['AC Payee', 'Crossed', 'Open', 'Bearer']),
  chequeNo: z.string().min(3, 'Select a cheque number'),
  chequeDate: z.string().min(1, 'Cheque date is required'),
  payTo: z.string().min(1, 'Pay to is required').max(120),
  chequeFor: z.enum(['Supplier', 'Employee', 'Customer', 'Other']).optional(),
  name: z.string().max(120).optional(),
  glAccountId: z.string().min(1, 'Select GL account'),
  amount: z.number().positive('Amount must be > 0'),
});

export const chequePrepareSchema = z
  .object({
    sourceType: z.enum(['direct', 'bill', 'iou']),
    accountsBankId: z.string().min(1, 'Select a bank account'),
    bankName: z.string().min(1, 'Bank name is required'),
    bookName: z.string().min(1, 'Book name is required'),

    chequeFor: z.enum(['Supplier', 'Employee', 'Customer', 'Other']).optional(),
    name: z.string().optional(),

    bill: z
      .object({
        billNo: z.string().min(1, 'Bill No is required'),
        billDate: z.string(),
        billValue: z.number(),
        prevPaid: z.number(),
        balance: z.number(),
        payAmount: z.number().positive('Pay amount must be > 0'),
      })
      .optional(),

    iou: z
      .object({
        requisitionNo: z.string().min(1, 'Requisition No is required'),
        reqDate: z.string(),
        reqValue: z.number(),
        prevPaid: z.number(),
        balance: z.number(),
        payAmount: z.number().positive('Pay amount must be > 0'),
      })
      .optional(),

    lines: z
      .array(prepareLineSchema)
      .min(1, 'At least one cheque line is required')
      .max(50, 'Max 50 lines per submission'),

    voucherDate: z.string().optional(),
    voucherType: z.string().optional(),
    narration: z.string().max(400, 'Narration cannot exceed 400 characters').optional(),
  })
  .superRefine((val, ctx) => {
    // Bill: exactly 1 line, amount = payAmount, amount <= balance
    if (val.sourceType === 'bill') {
      if (!val.bill) {
        ctx.addIssue({
          code: 'custom',
          message: 'Bill information is required',
          path: ['bill'],
        });
      } else {
        if (!val.name) {
          ctx.addIssue({
            code: 'custom',
            message: 'Supplier Name is required',
            path: ['name'],
          });
        }
        if (val.lines.length !== 1) {
          ctx.addIssue({
            code: 'custom',
            message: 'Bill prepare must have exactly one cheque',
            path: ['lines'],
          });
        }
        const line = val.lines[0];
        if (line && Math.abs(line.amount - val.bill.payAmount) > 0.01) {
          ctx.addIssue({
            code: 'custom',
            message: 'Amount must equal Pay amount',
            path: ['lines', 0, 'amount'],
          });
        }
        if (line && line.amount > val.bill.balance) {
          ctx.addIssue({
            code: 'custom',
            message: 'Amount cannot exceed Balance',
            path: ['lines', 0, 'amount'],
          });
        }
      }
    }

    // IOU: exactly 1 line, amount = payAmount, amount <= balance
    if (val.sourceType === 'iou') {
      if (!val.iou) {
        ctx.addIssue({
          code: 'custom',
          message: 'IOU requisition information is required',
          path: ['iou'],
        });
      } else {
        if (!val.name) {
          ctx.addIssue({
            code: 'custom',
            message: 'Employee Name is required',
            path: ['name'],
          });
        }
        if (val.lines.length !== 1) {
          ctx.addIssue({
            code: 'custom',
            message: 'IOU prepare must have exactly one cheque',
            path: ['lines'],
          });
        }
        const line = val.lines[0];
        if (line && Math.abs(line.amount - val.iou.payAmount) > 0.01) {
          ctx.addIssue({
            code: 'custom',
            message: 'Amount must equal Pay amount',
            path: ['lines', 0, 'amount'],
          });
        }
        if (line && line.amount > val.iou.balance) {
          ctx.addIssue({
            code: 'custom',
            message: 'Amount cannot exceed Balance',
            path: ['lines', 0, 'amount'],
          });
        }
      }
    }

    // Direct: no duplicate cheque numbers
    if (val.sourceType === 'direct') {
      const seen = new Set<string>();
      val.lines.forEach((l, i) => {
        if (l.chequeNo) {
          if (seen.has(l.chequeNo)) {
            ctx.addIssue({
              code: 'custom',
              message: `Duplicate cheque number: ${l.chequeNo}`,
              path: ['lines', i, 'chequeNo'],
            });
          }
          seen.add(l.chequeNo);
        }
        if (!l.chequeFor) {
          ctx.addIssue({
            code: 'custom',
            message: 'Cheque for is required',
            path: ['lines', i, 'chequeFor'],
          });
        }
        if (!l.name || !l.name.trim()) {
          ctx.addIssue({
            code: 'custom',
            message: 'Name is required',
            path: ['lines', i, 'name'],
          });
        }
      });
    }
  });

export type PrepareLineValues = z.infer<typeof prepareLineSchema>;
export type ChequePrepareFormValues = z.infer<typeof chequePrepareSchema>;
