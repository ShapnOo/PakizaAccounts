import {
  Currency,
  ValueShowIn,
  RPFilterState,
  RPTransaction,
  RPSummaryItem,
  BreakdownItem,
  RPStatementData,
} from '../types/receiptPayment';
import { convertFromBase } from './currencyConversion';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const DIVISORS: Record<ValueShowIn, number> = {
  'N/A': 1,
  'Thousand(/1000)': 1000,
  'Lakh(/100000)': 100000,
  'Million(/1000000)': 1000000,
  'Crore(/10000000)': 10000000,
};

export interface FormattedValue {
  text: string;
  isZero: boolean;
  isNegative: boolean;
  raw: number;
}

/**
 * Format any currency number strictly adhering to Inter font and user's value show in divisor
 */
export function formatRPValue(
  value: number,
  currency: Currency = 'BDT',
  valueShowIn: ValueShowIn = 'N/A'
): FormattedValue {
  if (value === 0 || isNaN(value)) {
    return {
      text: '—',
      isZero: true,
      isNegative: false,
      raw: 0,
    };
  }

  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const divisor = DIVISORS[valueShowIn] || 1;
  const scaled = absVal / divisor;
  const converted = convertFromBase(scaled, currency);

  // Decide decimal places based on divisor & currency
  const fractionDigits = divisor > 1 || currency !== 'BDT' ? 2 : 0;
  const locale = currency === 'BDT' ? 'en-IN' : 'en-US';

  const formattedNum = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(converted);

  const symbol = CURRENCY_SYMBOLS[currency] || '৳';
  const text = isNegative
    ? `(${symbol} ${formattedNum})`
    : `${symbol} ${formattedNum}`;

  return {
    text,
    isZero: false,
    isNegative,
    raw: convertFromBase(value, currency),
  };
}

/**
 * Converts ISO date (e.g. 2026-10-01) to DD-MM-YY (01-10-26) matching the source workbook
 */
export function formatShortDate(isoString: string): string {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length === 3) {
    const yearShort = parts[0].slice(-2);
    const month = parts[1];
    const day = parts[2];
    return `${day}-${month}-${yearShort}`;
  }
  return isoString;
}

/**
 * Aggregates a list of transactions by Opposite Account
 */
export function aggregateTransactionsByOppositeAccount(
  transactions: RPTransaction[]
): RPSummaryItem[] {
  const map = new Map<string, { amount: number; count: number }>();

  transactions.forEach((tx) => {
    const key = tx.oppositeAccounts || 'Unspecified';
    const existing = map.get(key) || { amount: 0, count: 0 };
    map.set(key, {
      amount: existing.amount + tx.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(map.entries()).map(([oppositeAccounts, { amount, count }]) => ({
    oppositeAccounts,
    amount,
    voucherCount: count,
  }));
}

/**
 * Computes complete Receipt & Payment statement with balanced equation check
 */
export function calculateRPStatement(
  filters: RPFilterState,
  openingBreakdown: BreakdownItem[],
  receipts: RPTransaction[],
  payments: RPTransaction[]
): RPStatementData {
  // Filter receipts and payments by approval status and account types if set
  const filteredReceipts = receipts.filter((tx) => {
    if (filters.approvalStatus !== 'All' && tx.approvalStatus && tx.approvalStatus !== filters.approvalStatus) {
      return false;
    }
    if (filters.accountsDetailsTypes.length > 0 && tx.accountType) {
      if (!filters.accountsDetailsTypes.includes(tx.accountType)) return false;
    }
    if (filters.accountsHead && tx.oppositeAccounts) {
      if (!tx.oppositeAccounts.toLowerCase().includes(filters.accountsHead.toLowerCase())) return false;
    }
    return true;
  });

  const filteredPayments = payments.filter((tx) => {
    if (filters.approvalStatus !== 'All' && tx.approvalStatus && tx.approvalStatus !== filters.approvalStatus) {
      return false;
    }
    if (filters.accountsDetailsTypes.length > 0 && tx.accountType) {
      if (!filters.accountsDetailsTypes.includes(tx.accountType)) return false;
    }
    if (filters.accountsHead && tx.oppositeAccounts) {
      if (!tx.oppositeAccounts.toLowerCase().includes(filters.accountsHead.toLowerCase())) return false;
    }
    return true;
  });

  // Calculate Opening Total
  const openingTotal = openingBreakdown.reduce((sum, item) => sum + item.amount, 0);

  // Total Debit (Receipt transactions)
  const totalDebit = filteredReceipts.reduce((sum, item) => sum + item.amount, 0);
  const grandTotalReceipt = openingTotal + totalDebit;

  // Total Credit (Payment transactions)
  const totalCredit = filteredPayments.reduce((sum, item) => sum + item.amount, 0);

  // Dynamically calculate closing breakdown
  // Cash moves: opening cash + cash receipts - cash payments
  const cashOpening = openingBreakdown.find((b) => b.key === 'cash')?.amount || 0;
  const cashReceipts = filteredReceipts
    .filter((r) => !r.accountType || r.accountType === 'Cash')
    .reduce((sum, r) => sum + r.amount, 0);
  const cashPayments = filteredPayments
    .filter((p) => !p.accountType || p.accountType === 'Cash')
    .reduce((sum, p) => sum + p.amount, 0);
  const closingCash = cashOpening + cashReceipts - cashPayments;

  const bankOpening = openingBreakdown.find((b) => b.key === 'bank')?.amount || 0;
  const cashEqOpening = openingBreakdown.find((b) => b.key === 'cashEquivalent')?.amount || 0;

  const closingBreakdown: BreakdownItem[] = [
    { key: 'cash', label: 'Cash', amount: closingCash },
    { key: 'bank', label: 'Bank', amount: bankOpening },
    { key: 'cashEquivalent', label: 'Cash Equivalent', amount: cashEqOpening },
  ];

  const closingTotal = closingBreakdown.reduce((sum, b) => sum + b.amount, 0);
  const grandTotalPayment = totalCredit + closingTotal;

  const difference = grandTotalReceipt - grandTotalPayment;
  const isBalanced = Math.abs(difference) < 0.01;

  const receiptSummaryItems = aggregateTransactionsByOppositeAccount(filteredReceipts);
  const paymentSummaryItems = aggregateTransactionsByOppositeAccount(filteredPayments);

  const startFormatted = formatShortDate(filters.startDate);
  const endFormatted = formatShortDate(filters.endDate);

  return {
    receiptOpening: {
      title: `Balance B/D As on ${startFormatted}`,
      asOnDate: startFormatted,
      total: openingTotal,
      breakdown: openingBreakdown,
    },
    receiptTransactions: filteredReceipts,
    receiptSummaryItems,
    totalDebit,
    grandTotalReceipt,

    paymentTransactions: filteredPayments,
    paymentSummaryItems,
    totalCredit,
    paymentClosing: {
      title: `Balance C/D As on ${endFormatted}`,
      asOnDate: endFormatted,
      total: closingTotal,
      breakdown: closingBreakdown,
    },
    grandTotalPayment,
    isBalanced,
    difference,
  };
}

