import { z } from 'zod';
import {
  FILTER_FIELDS,
  VALUELESS_OPERATORS,
  FilterOperator,
} from '../../types/advanceFilter';

export const filterConditionSchema = z
  .object({
    id: z.string(),
    fieldKey: z.string().min(1),
    operator: z.string().min(1),
    value: z.union([
      z.string(),
      z.number(),
      z.tuple([z.number(), z.number()]),
      z.tuple([z.string(), z.string()]),
      z.null(),
    ]),
  })
  .superRefine((c, ctx) => {
    const field = FILTER_FIELDS.find((f) => f.key === c.fieldKey);
    if (!field) return;

    // Value required for non-valueless operators
    if (!VALUELESS_OPERATORS.includes(c.operator as FilterOperator)) {
      if (c.value == null || c.value === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Value is required',
          path: ['value'],
        });
      }
    }

    // Between requires tuple with 2 non-empty values
    if (c.operator === 'between') {
      if (!Array.isArray(c.value) || c.value.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Between requires Min and Max values',
          path: ['value'],
        });
      }
    }
  });

export const advanceFilterSchema = z.object({
  combinator: z.enum(['AND', 'OR']),
  conditions: z.array(filterConditionSchema).max(10, 'Max 10 filter conditions allowed'),
  collapsed: z.boolean(),
});
