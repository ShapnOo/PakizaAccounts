import { z } from 'zod';
import { SubledgerEntry } from '../../types/subledger';

export const subledgerSchema = z.object({
  type: z.enum(['cost-center', 'reference-center', 'vehicle']),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must not exceed 120 characters'),
  effectiveCompanyIds: z
    .array(z.string())
    .min(1, 'Select at least one company'),
  activeStatus: z.enum(['Active', 'Inactive']),
});

export type SubledgerFormData = z.infer<typeof subledgerSchema>;

/**
 * Validates uniqueness: Name must be unique per (type, company) combination.
 */
export function validateSubledgerUniqueness(
  name: string,
  type: string,
  effectiveCompanyIds: string[],
  existingEntries: SubledgerEntry[],
  currentEntryId?: string
): string | null {
  const normalizedName = name.trim().toLowerCase();
  
  for (const entry of existingEntries) {
    if (currentEntryId && entry.id === currentEntryId) continue;
    if (entry.type !== type) continue;

    // If same type and name matches
    if (entry.name.trim().toLowerCase() === normalizedName) {
      // Check if there is any overlapping company
      const hasOverlappingCompany = entry.effectiveCompanyIds.some((cId) =>
        effectiveCompanyIds.includes(cId)
      );
      if (hasOverlappingCompany) {
        return `"${name.trim()}" already exists for one of the selected companies.`;
      }
    }
  }

  return null;
}
