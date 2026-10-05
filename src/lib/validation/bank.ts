import { z } from 'zod';

export const bankAccountRefSchema = z.object({
  id: z.string(),
  coaAccountId: z.string().min(1, 'COA account ID required'),
  accountsType: z.string().min(1, 'Account type required'),
  accountsNumber: z.string().min(1, 'Account number required'),
  accountsName: z.string().min(1, 'Account name required'),
});

export const bankSchema = z.object({
  name: z
    .string()
    .min(3, 'Bank name must be at least 3 characters')
    .max(100, 'Bank name must not exceed 100 characters'),
  alias: z
    .string()
    .min(2, 'Alias must be at least 2 characters')
    .max(10, 'Alias must not exceed 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Uppercase letters and digits only'),
});

export const branchSchema = z.object({
  bankId: z.string().min(1, 'Please select a bank'),
  bankName: z.string().min(1, 'Bank name is required'),
  bankAlias: z.string().min(1, 'Bank alias is required'),
  branchName: z
    .string()
    .min(2, 'Branch name must be at least 2 characters')
    .max(80, 'Branch name must not exceed 80 characters'),
  address: z.string().max(200, 'Address cannot exceed 200 characters').optional().or(z.literal('')),
  routingNo: z.string().max(20, 'Routing number cannot exceed 20 characters').optional().or(z.literal('')),
  swiftCode: z
    .string()
    .max(11, 'SWIFT code cannot exceed 11 characters')
    .regex(/^[A-Z0-9]*$/, 'Uppercase letters and digits only')
    .optional()
    .or(z.literal('')),
  accounts: z.array(bankAccountRefSchema),
});

export type BankFormValues = z.infer<typeof bankSchema>;
export type BranchFormValues = z.infer<typeof branchSchema>;
