import { CommaFormat } from '../../types/currency';

/**
 * Format a number according to the selected CommaFormat and decimal places.
 */
export function formatWithCommaStyle(
  val: number | string | undefined | null,
  format: CommaFormat = '1,234,567,890',
  decimals: number = 2
): string {
  if (val === undefined || val === null || val === '') return '0.00';
  const num = typeof val === 'number' ? val : parseFloat(val.toString().replace(/,/g, ''));
  if (isNaN(num)) return '0.00';

  const fixed = Math.abs(num).toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const sign = num < 0 ? '-' : '';

  let formattedInt = intPart;

  switch (format) {
    case '12,34,56,789': {
      // Indian lakh/crore grouping: last 3 digits, then groups of 2
      if (intPart.length > 3) {
        const lastThree = intPart.substring(intPart.length - 3);
        const remaining = intPart.substring(0, intPart.length - 3);
        const withCommas = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        formattedInt = `${withCommas},${lastThree}`;
      }
      return `${sign}${formattedInt}${decimals > 0 ? '.' + decPart : ''}`;
    }

    case '1.234.567.890': {
      // European grouping: periods for thousands, comma for decimals
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `${sign}${formattedInt}${decimals > 0 ? ',' + decPart : ''}`;
    }

    case '12 34 56 789': {
      // Space separated
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return `${sign}${formattedInt}${decimals > 0 ? '.' + decPart : ''}`;
    }

    case '123456789': {
      // No grouping
      return `${sign}${intPart}${decimals > 0 ? '.' + decPart : ''}`;
    }

    case '1,234,567,890':
    default: {
      // Western standard grouping
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${sign}${formattedInt}${decimals > 0 ? '.' + decPart : ''}`;
    }
  }
}

/**
 * Format currency with its symbol and custom format
 */
export function formatCurrencyDisplay(
  amount: number,
  symbol: string,
  format: CommaFormat = '1,234,567,890',
  decimals: number = 2
): string {
  const formatted = formatWithCommaStyle(amount, format, decimals);
  return `${symbol} ${formatted}`;
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

