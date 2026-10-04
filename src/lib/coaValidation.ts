import { z } from 'zod';
import { MANDATORY_DETAILS_TYPES } from '../constants/accountsTypeTree';

export const accountFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Accounts name must be at least 3 characters')
      .max(120, 'Accounts name cannot exceed 120 characters'),
    accountsType: z.string().min(1, 'Please select an Accounts Type'),
    parentId: z.string().nullable().optional(),
    manualCode: z
      .string()
      .trim()
      .regex(/^[0-9]*$/, 'Manual code must be numbers only')
      .optional()
      .or(z.literal('')),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
    activeStatus: z.enum(['Active', 'Inactive']),
    companyName: z.string().min(1, 'Company Name is required'),
    isParent: z.boolean(),
    defaultCurrency: z.literal('BDT'),
    isMandatory: z.boolean().optional(),
    aux: z
      .object({
        supplier: z.string().optional(),
        customer: z.string().optional(),
        employee: z.string().optional(),
        reference: z.string().optional(),
        vehicle: z.string().optional(),
      })
      .optional(),
    detailsType: z.string().optional(),
    bankDetails: z
      .object({
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountType: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // If not "isParent", check details conditional logic
    if (!data.isParent) {
      // RULE R8: If accountsType is one of the 4 mandatory types, detailsType is required
      const isMandatoryType = MANDATORY_DETAILS_TYPES.includes(
        data.accountsType as (typeof MANDATORY_DETAILS_TYPES)[number]
      );

      if (isMandatoryType && (!data.detailsType || data.detailsType.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['detailsType'],
          message: 'Details Field Mandatory for this accounts.',
        });
      }

      // RULE R7: If detailsType === 'Bank', Bank Name, Accounts Number, Accounts Type are required
      if (data.detailsType === 'Bank') {
        if (!data.bankDetails?.bankName?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bankDetails', 'bankName'],
            message: 'Bank Name is required for Bank details type',
          });
        }
        if (!data.bankDetails?.accountNumber?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bankDetails', 'accountNumber'],
            message: 'Accounts Number is required for Bank details type',
          });
        }
        if (!data.bankDetails?.accountType?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['bankDetails', 'accountType'],
            message: 'Accounts Type (CD/SB/CC/OD) is required for Bank details type',
          });
        }
      }
    }
  });

export type AccountFormValues = z.infer<typeof accountFormSchema>;
