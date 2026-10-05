import { ChequeBook, ChequeEntry } from '../types/cheque';

/**
 * Filters available cheques for a book:
 * - Excludes inactive and already used cheques
 * - If enforceBySerial is true, sorts ascending by SL
 */
export function availableCheques(
  book: ChequeBook | null | undefined,
  enforceBySerial: boolean = false
): ChequeEntry[] {
  if (!book || !Array.isArray(book.cheques)) return [];
  const pool = book.cheques.filter((c) => !c.isInactive && !c.used);
  const sorted = [...pool].sort((a, b) => a.sl - b.sl);
  return sorted;
}

/**
 * Checks if a specific cheque is selectable under serial enforcement rules.
 * If enforceBySerial is active, only the lowest SL available cheque is selectable.
 */
export function isChequeLockedBySerial(
  cheque: ChequeEntry,
  allAvailable: ChequeEntry[],
  enforceBySerial: boolean
): boolean {
  if (!enforceBySerial) return false;
  if (allAvailable.length === 0) return false;
  const lowestSl = allAvailable[0].sl;
  return cheque.sl > lowestSl;
}
