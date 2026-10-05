/**
 * Generates N sequential cheque numbers incrementing by 1 from the first,
 * preserving prefix and digit width (zero-padding).
 *
 * Example:
 * generateChequeNumbers('CQ26000001', 3)
 * -> ['CQ26000001', 'CQ26000002', 'CQ26000003']
 */
export function generateChequeNumbers(firstNo: string, count: number): string[] {
  if (count <= 0) return [];
  const cleanFirst = firstNo.trim().toUpperCase();
  const m = cleanFirst.match(/^(.*?)(\d+)$/);
  if (!m) {
    return Array.from({ length: count }, (_, i) => `${cleanFirst}-${i + 1}`);
  }
  const [, prefix, numStr] = m;
  const width = numStr.length;
  const start = parseInt(numStr, 10);

  return Array.from({ length: count }, (_, i) => {
    const nextVal = start + i;
    return `${prefix}${String(nextVal).padStart(width, '0')}`;
  });
}
