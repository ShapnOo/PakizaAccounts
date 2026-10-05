/**
 * Currency and number formatters for accounting
 */
export function formatCurrency(
  val: number | undefined | null,
  currency: string = 'BDT',
  decimals: number = 2
): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatNumber(
  val: number | undefined | null,
  decimals: number = 2
): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function parseNumber(input: string | number | undefined | null): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  const cleaned = input.toString().replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
