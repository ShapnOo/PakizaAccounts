import { z } from 'zod';

export const bsFilterSchema = z.object({
  asOn: z.string().min(1, 'Date required'),
  compareWith: z.enum([
    'Previous Years',
    'Budget',
    'None',
    'Custom Period',
  ]),
  showInPercent: z.boolean(),
  valueShowIn: z.enum(['N/A', 'Absolute', 'Percent', 'Ratio']),
  numberOfYears: z.number().int().min(0).max(10),
  currency: z.string().min(1),
  subLedger: z.boolean(),
  advancedFilterCollapsed: z.boolean(),
  expandAll: z.boolean(),
  customStartDate: z.string().optional(),
  customEndDate: z.string().optional(),
});

export type BSFilterSchemaType = z.infer<typeof bsFilterSchema>;

/**
 * Validates balance between total assets and total liabilities & equity
 */
export function checkBalance(
  totalAssets: number[],
  totalLiabEquity: number[]
): {
  isBalanced: boolean;
  differences: number[];
  maxDiff: number;
} {
  const len = Math.max(totalAssets.length, totalLiabEquity.length);
  const differences: number[] = [];
  let isBalanced = true;
  let maxDiff = 0;

  for (let i = 0; i < len; i++) {
    const a = totalAssets[i] || 0;
    const le = totalLiabEquity[i] || 0;
    const diff = a - le;
    differences.push(diff);
    if (Math.abs(diff) > 0.001) {
      isBalanced = false;
    }
    if (Math.abs(diff) > maxDiff) {
      maxDiff = Math.abs(diff);
    }
  }

  return { isBalanced, differences, maxDiff };
}

