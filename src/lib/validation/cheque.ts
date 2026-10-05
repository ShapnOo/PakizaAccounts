import { z } from 'zod';

export const chequeEntrySchema = z.object({
  id: z.string(),
  sl: z.number().int().min(1),
  chequeNo: z.string().min(1),
  isInactive: z.boolean(),
  signatory: z.string().max(80),
  used: z.boolean(),
  usedOnVoucherId: z.string().optional(),
});

export const chequeBookSchema = z.object({
  accountsBankId: z.string().min(1, 'Select a bank account'),
  bankName: z.string().min(1, 'Bank name is required'),
  glName: z.string().min(1, 'GL name is required'),
  enforceBySerial: z.boolean(),
  bookName: z.string().min(2, 'Book name must be at least 2 characters').max(60),
  firstChequeNo: z
    .string()
    .min(3, 'First cheque number must be at least 3 characters')
    .max(30)
    .regex(/^[A-Z0-9]+$/, 'Uppercase letters and digits only'),
  noOfCheque: z
    .number()
    .int('Number of cheques must be an integer')
    .min(1, 'At least 1 cheque required')
    .max(500, 'Maximum 500 cheques per book'),
  cheques: z.array(chequeEntrySchema).min(1, 'Please click "ADD>>" to generate cheque details'),
});

export const preparedChequeSchema = z
  .object({
    sourceType: z.enum(['direct', 'bill', 'iou']),
    chequeBookId: z.string().min(1, 'Select a cheque book'),
    accountsBankId: z.string().min(1, 'Select a bank account'),
    bankName: z.string().min(1),
    bookName: z.string().min(1),
    chequeFor: z.enum(['Supplier', 'Employee', 'Customer', 'Other']),
    partyName: z.string().min(1, 'Select party name'),

    billNo: z.string().optional(),
    billDate: z.string().optional(),
    billValue: z.number().optional(),
    prevPaid: z.number().optional(),
    balance: z.number().optional(),
    payAmount: z.number().optional(),

    chequeType: z.enum(['AC Payee', 'Crossed', 'Open', 'Bearer']),
    chequeNo: z.string().min(3, 'Select an available cheque number'),
    chequeDate: z.string().min(1, 'Cheque date is required'),
    payTo: z.string().min(1, 'Pay to recipient is required').max(120),
    glAccountId: z.string().min(1, 'Select GL account'),
    amount: z.number().positive('Amount must be greater than 0'),

    voucherDate: z.string().optional(),
    voucherType: z.string().optional(),
    narration: z.string().max(300, 'Narration cannot exceed 300 characters').optional(),
  })
  .refine(
    (d) => (d.sourceType === 'direct' ? true : (d.payAmount ?? 0) > 0),
    {
      message: 'Pay amount is required for bill/IOU payment',
      path: ['payAmount'],
    }
  )
  .refine(
    (d) =>
      d.sourceType === 'direct'
        ? true
        : d.amount <= (d.balance ?? Infinity),
    {
      message: 'Amount cannot exceed available balance',
      path: ['amount'],
    }
  );

export type ChequeBookFormValues = z.infer<typeof chequeBookSchema>;
export type PreparedChequeFormValues = z.infer<typeof preparedChequeSchema>;
