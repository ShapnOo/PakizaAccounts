import { z } from 'zod';
import { validateFormula } from '../isCustomizationMath';

export const customizationSchema = z
  .object({
    reportType: z.enum(['Comprehensive', 'Summary']),
    reportTitle: z.string().min(3).max(120),
    rows: z
      .array(
        z.object({
          id: z.string(),
          kind: z.enum(['parent', 'child']),
          particulars: z.string().min(1, 'Particulars is required').max(120),
          code: z.string().min(1, 'Code is required').max(4),
          formula: z.string().optional(),
          parentCode: z.string().optional(),
          isCustom: z.boolean().optional(),
          order: z.number().int().min(0),
        })
      )
      .min(1, 'At least one row is required'),
  })
  .superRefine((val, ctx) => {
    // Unique codes
    const codes = val.rows.map((r) => r.code.toUpperCase());
    const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
    if (dupes.length > 0) {
      ctx.addIssue({
        code: 'custom',
        message: `Duplicate codes: ${[...new Set(dupes)].join(', ')}`,
        path: ['rows'],
      });
    }

    // Valid parent formulas
    val.rows.forEach((r, i) => {
      if (r.kind === 'parent') {
        const check = validateFormula(r.formula ?? '', val.rows);
        if (!check.valid) {
          ctx.addIssue({
            code: 'custom',
            message: check.error ?? 'Invalid formula',
            path: ['rows', i, 'formula'],
          });
        }
      }
    });

    // Every child has valid parent
    const parentCodes = new Set(
      val.rows.filter((r) => r.kind === 'parent').map((r) => r.code.toUpperCase())
    );
    val.rows.forEach((r, i) => {
      if (r.kind === 'child') {
        if (!r.parentCode || !parentCodes.has(r.parentCode.toUpperCase())) {
          ctx.addIssue({
            code: 'custom',
            message: 'Child must be assigned to an existing parent section',
            path: ['rows', i, 'parentCode'],
          });
        }
      }
    });
  });
