import { z } from 'zod';
import { CustomField } from '../../types/customField';

export const customFieldSchema = z
  .object({
    context: z.enum([
      'journal',
      'payment',
      'receive',
      'contra',
      'opening-balance',
      'coa',
    ]),
    label: z
      .string()
      .trim()
      .min(2, 'Label must be at least 2 characters')
      .max(40, 'Label must not exceed 40 characters'),
    dataType: z.enum([
      'Text',
      'LongText',
      'Number',
      'Currency',
      'Date',
      'DateTime',
      'Dropdown',
      'YesNo',
      'MultiSelect',
    ]),
    mandatory: z.boolean(),
    activeStatus: z.enum(['Active', 'Inactive']),
    options: z.array(z.string()).optional(),
    defaultValue: z
      .union([z.string(), z.number(), z.boolean(), z.null()])
      .optional(),
  })
  .refine(
    (d) => {
      if (d.dataType === 'Dropdown' || d.dataType === 'MultiSelect') {
        return (
          Array.isArray(d.options) &&
          d.options.filter((o) => o.trim().length > 0).length > 0
        );
      }
      return true;
    },
    { message: 'Please add at least one option', path: ['options'] }
  );

export type CustomFieldFormData = z.infer<typeof customFieldSchema>;

/**
 * Validates label uniqueness per context
 */
export function validateLabelUniqueness(
  label: string,
  context: string,
  existingFields: CustomField[],
  currentFieldId?: string
): string | null {
  const normalized = label.trim().toLowerCase();
  const duplicate = existingFields.find(
    (f) =>
      f.id !== currentFieldId &&
      f.context === context &&
      f.label.trim().toLowerCase() === normalized
  );
  if (duplicate) {
    return `Field label "${label.trim()}" already exists in this context.`;
  }
  return null;
}
