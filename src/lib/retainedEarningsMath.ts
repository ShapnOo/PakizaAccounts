import {
  MovementRow,
  EquityRow,
  RetainedEarningsReport,
  DateRange,
} from '../types/retainedEarnings';

/**
 * Compute the Closing Retained Earnings:
 *   closing = opening + (all "add" amounts) − (all "less" amounts)
 */
export function computeClosing(movement: MovementRow[]): number {
  const opening =
    movement.find((m) => m.rowType === 'opening')?.amount ?? 0;
  const adds = movement
    .filter((m) => m.rowType === 'add')
    .reduce((s, m) => s + m.amount, 0);
  const lesses = movement
    .filter((m) => m.rowType === 'less')
    .reduce((s, m) => s + m.amount, 0);
  return opening + adds - lesses;
}

/**
 * Recompute the entire report:
 *  - Closing Retained Earnings from movement
 *  - Earnings (equity) mirrors Closing
 *  - Total equity = sum of all equity amounts
 */
export function computeReport(
  movement: MovementRow[],
  equity: EquityRow[],
  dateRange: DateRange = 'This Period',
  customFrom?: string,
  customTo?: string
): RetainedEarningsReport {
  const closing = computeClosing(movement);

  const nextMovement = movement.map((m) =>
    m.rowType === 'closing' ? { ...m, amount: closing } : m
  );

  const nextEquity = equity.map((e) =>
    e.source === 'linked' && e.linkedTo === 'closingRetainedEarnings'
      ? { ...e, amount: closing }
      : e
  );

  const totalEquity = nextEquity.reduce((s, e) => s + e.amount, 0);

  return {
    dateRange,
    customFrom,
    customTo,
    movement: nextMovement,
    equity: nextEquity,
    totals: {
      closingRetainedEarnings: closing,
      totalEquity,
    },
  };
}

/**
 * Format a currency amount with BDT symbol + en-IN grouping.
 * Values stay in Inter font — no monospace.
 */
export function formatBDT(value: number): string {
  if (value === 0 || isNaN(value)) return '—';
  const fmt = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const isNegative = value < 0;
  const sym = isNegative ? '-৳' : '৳';
  return `${sym} ${fmt.format(Math.abs(value))}`;
}

