export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // 1 Foreign Currency = rate BDT. So amountInForeign = amountInBdt / rate
  name: string;
  decimals: number;
}

export const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  BDT: { code: 'BDT', symbol: '৳', rate: 1, name: 'Bangladeshi Taka', decimals: 0 },
  USD: { code: 'USD', symbol: '$', rate: 120.4, name: 'US Dollar', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', rate: 132.8, name: 'Euro', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', rate: 163.24, name: 'British Pound', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', rate: 1.44, name: 'Indian Rupee', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', rate: 0.81, name: 'Japanese Yen', decimals: 0 },
  CAD: { code: 'CAD', symbol: 'C$', rate: 89.15, name: 'Canadian Dollar', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', rate: 81.3, name: 'Australian Dollar', decimals: 2 },
  SAR: { code: 'SAR', symbol: '﷼', rate: 32.1, name: 'Saudi Riyal', decimals: 2 },
  AED: { code: 'AED', symbol: 'د.إ', rate: 32.78, name: 'UAE Dirham', decimals: 2 },
};

export const REPORT_CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'INR'] as const;

export type ValueShowInMode =
  | 'actual'
  | 'auto'
  | 'thousand'
  | 'million'
  | 'billion';

export const VALUE_SHOW_IN_LABELS: { value: ValueShowInMode; label: string }[] = [
  { value: 'actual', label: 'Actual (N/A)' },
  { value: 'auto', label: 'Auto (K, M, B)' },
  { value: 'thousand', label: 'In Thousands (K)' },
  { value: 'million', label: 'In Millions (M)' },
  { value: 'billion', label: 'In Billions (B)' },
];

/**
 * Converts a base BDT amount into the target currency.
 */
export function convertFromBase(amountInBdt: number, targetCurrency: string): number {
  if (!amountInBdt || isNaN(amountInBdt)) return 0;
  const info = CURRENCY_MAP[targetCurrency] || { rate: 1 };
  if (!info.rate || info.rate === 0) return amountInBdt;
  return amountInBdt / info.rate;
}

/**
 * Returns the currency symbol for the given currency code.
 */
export function getCurrencySymbol(currencyCode: string): string {
  return CURRENCY_MAP[currencyCode]?.symbol || currencyCode;
}

/**
 * Scales an amount and returns its compact suffix (K, M, B) and recommended decimals.
 */
export function formatCompactValue(
  amount: number,
  mode: ValueShowInMode = 'actual'
): { scaled: number; suffix: string; decimals: number } {
  if (amount === 0 || isNaN(amount)) {
    return { scaled: 0, suffix: '', decimals: 0 };
  }

  const abs = Math.abs(amount);

  if (mode === 'thousand') {
    const scaled = amount / 1000;
    const decimals = Number.isInteger(scaled) ? 0 : 2;
    return { scaled, suffix: 'K', decimals };
  }

  if (mode === 'million') {
    const scaled = amount / 1000000;
    const decimals = Number.isInteger(scaled) ? 0 : 2;
    return { scaled, suffix: 'M', decimals };
  }

  if (mode === 'billion') {
    const scaled = amount / 1000000000;
    const decimals = Number.isInteger(scaled) ? 0 : 2;
    return { scaled, suffix: 'B', decimals };
  }

  if (mode === 'auto') {
    if (abs >= 1000000000) {
      const scaled = amount / 1000000000;
      const decimals = Number.isInteger(scaled) ? 0 : Math.abs(scaled) < 10 ? 2 : 1;
      return { scaled, suffix: 'B', decimals };
    }
    if (abs >= 1000000) {
      const scaled = amount / 1000000;
      const decimals = Number.isInteger(scaled) ? 0 : Math.abs(scaled) < 10 ? 2 : 1;
      return { scaled, suffix: 'M', decimals };
    }
    if (abs >= 1000) {
      const scaled = amount / 1000;
      const decimals = Number.isInteger(scaled) ? 0 : Math.abs(scaled) < 10 ? 2 : 1;
      return { scaled, suffix: 'K', decimals };
    }
    return { scaled: amount, suffix: '', decimals: 0 };
  }

  // mode === 'actual'
  return { scaled: amount, suffix: '', decimals: 0 };
}

/**
 * Formats a base BDT amount into the target currency with its symbol, compact notation (K, M, B) and locale formatting.
 */
export function formatCurrencyAmount(
  amountInBdt: number,
  currencyCode: string = 'BDT',
  showDashForZero: boolean = true,
  valueShowIn: ValueShowInMode = 'actual'
): string {
  if (amountInBdt === 0 || isNaN(amountInBdt)) {
    return showDashForZero ? '—' : '0';
  }

  const info = CURRENCY_MAP[currencyCode] || { symbol: currencyCode, rate: 1, decimals: 2 };
  const converted = convertFromBase(amountInBdt, currencyCode);

  const { scaled, suffix, decimals: compactDecimals } = formatCompactValue(
    converted,
    valueShowIn
  );
  const isNegative = scaled < 0;
  const absVal = Math.abs(scaled);

  const decimals =
    valueShowIn !== 'actual'
      ? compactDecimals
      : currencyCode === 'BDT'
      ? 0
      : info.decimals ?? 2;

  const locale = currencyCode === 'BDT' || currencyCode === 'INR' ? 'en-IN' : 'en-US';

  const formattedNum = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absVal);

  return `${isNegative ? '-' : ''}${info.symbol} ${formattedNum}${suffix}`;
}

