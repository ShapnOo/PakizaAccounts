import { ISRow, ValueShowIn } from '../types/incomeStatement';
import { convertFromBase } from './currencyConversion';

/**
 * Currency symbol mapping
 */
export function currencySymbol(code: string): string {
  const map: Record<string, string> = {
    BDT: '৳',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  return map[code] || code;
}

/**
 * Compute rollups for Income Statement rows:
 *  Operating Income (A) = Sales Revenue
 *  Gross Profit (C) = Operating Income (A) − Cost of Goods (B)
 *  Net Profit Before Tax (F) = Gross Profit (C) + Non-Operating (D) − Indirect (E)
 *  Net Profit After Tax = Net Profit Before Tax (F) − Tax (G)
 */
export function computeRollups(rows: ISRow[], colCount: number): void {
  const get = (key: string): number[] => {
    const r = rows.find((row) => row.key === key);
    return r ? [...r.values] : new Array(colCount).fill(0);
  };

  const sales = get('salesRevenue');
  const cogs = get('costOfGoods');
  const exch = get('exchangeGainLoss');
  const scrap = get('scrapsRevenue');
  const admin = get('adminExpenses');
  const sell = get('sellingExpenses');
  const fin = get('financialExpenses');
  const tax = get('incomeTax');

  // Non-Operating Income = exchange + scrap
  const nonOp = exch.map((v, i) => v + (scrap[i] || 0));

  // Indirect Expenses = admin + selling + financial
  const indirect = admin.map((v, i) => v + (sell[i] || 0) + (fin[i] || 0));

  // Operating Income (A)
  const opIncome = [...sales];

  // Gross Profit (C = A - B)
  const grossProfit = opIncome.map((v, i) => v - (cogs[i] || 0));

  // Net Profit Before Tax (F = C + D - E)
  const netBeforeTax = grossProfit.map((v, i) => v + (nonOp[i] || 0) - (indirect[i] || 0));

  // Net Profit After Tax (NPAT = F - G)
  const netAfterTax = netBeforeTax.map((v, i) => v - (tax[i] || 0));

  // Summary Income Header total = sales + exchange + scrap
  const totalSummaryIncome = sales.map((v, i) => v + (exch[i] || 0) + (scrap[i] || 0));

  // Summary Expense Header total = cogs + admin + sell + fin
  const totalSummaryExpenses = cogs.map((v, i) => v + (admin[i] || 0) + (sell[i] || 0) + (fin[i] || 0));

  // Summary Net Profit Before Tax = Income - Expenses
  const summaryNetBeforeTax = totalSummaryIncome.map((v, i) => v - (totalSummaryExpenses[i] || 0));

  const setRowValues = (key: string, vals: number[]) => {
    const row = rows.find((r) => r.key === key);
    if (row) {
      row.values = vals;
    }
  };

  // Comprehensive
  setRowValues('operatingIncome', opIncome);
  setRowValues('lessCostOfGoods', cogs);
  setRowValues('grossProfit', grossProfit);
  setRowValues('nonOperatingIncome', nonOp);
  setRowValues('lessIndirectExpenses', indirect);
  setRowValues('netProfitBeforeTax', netBeforeTax);
  setRowValues('lessTax', tax);
  setRowValues('netProfitAfterTax', netAfterTax);

  // Summary
  setRowValues('incomeHeader', totalSummaryIncome);
  setRowValues('expensesHeader', totalSummaryExpenses);
  if (rows.some((r) => r.key === 'incomeHeader')) {
    setRowValues('netProfitBeforeTax', summaryNetBeforeTax);
  }
}

/**
 * Format a value per currency, showInPercent, and valueShowIn display modes.
 * Returns text with strict Inter font styling compatibility.
 */
export function formatValue(
  value: number,
  currency: string,
  showInPercent: boolean,
  baseForPercent: number | null,
  valueShowIn: ValueShowIn = 'N/A'
): { text: string; isZero: boolean; isNegative: boolean } {
  const isZero = value === 0;
  const isNegative = value < 0;

  if (isZero) {
    return { text: '—', isZero: true, isNegative: false };
  }

  // 1. Show in % or valueShowIn === 'Percent'
  if (showInPercent || valueShowIn === 'Percent') {
    if (!baseForPercent || baseForPercent === 0) {
      return { text: '0.00%', isZero: false, isNegative };
    }
    const pct = (value / baseForPercent) * 100;
    return {
      text: `${pct >= 0 ? '' : '-'}${Math.abs(pct).toFixed(2)}%`,
      isZero: false,
      isNegative: pct < 0,
    };
  }

  // 2. Ratio
  if (valueShowIn === 'Ratio') {
    if (baseForPercent && baseForPercent !== 0) {
      const ratio = value / baseForPercent;
      return {
        text: ratio.toFixed(3),
        isZero: false,
        isNegative: ratio < 0,
      };
    }
    return {
      text: (value / 1000).toFixed(1) + 'k',
      isZero: false,
      isNegative,
    };
  }

  // 3. Absolute
  if (valueShowIn === 'Absolute') {
    const absVal = Math.abs(value);
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(absVal);
    return {
      text: formatted,
      isZero: false,
      isNegative: false,
    };
  }

  // 4. Default: Currency Formatted
  const sym = currencySymbol(currency);
  const converted = convertFromBase(value, currency);
  const decimals = currency === 'BDT' ? 0 : 2;
  const locale = currency === 'BDT' || currency === 'INR' ? 'en-IN' : 'en-US';
  const formattedNum = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(converted));

  const text = `${converted < 0 ? '-' : ''}${sym} ${formattedNum}`;

  return {
    text,
    isZero: false,
    isNegative: converted < 0,
  };
}

