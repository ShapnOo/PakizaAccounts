import {
  TBLedgerRow,
  TBReport,
  ValueShowIn,
  Currency,
  VALUE_SHOW_IN_OPTIONS,
} from '../types/trialBalance';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

/**
 * Universal closing formula:
 *   Closing(DR) = Opening(Dr) + Debit
 *   Closing(CR) = Opening(CR) + Credit
 */
export function computeClosing(
  row: TBLedgerRow
): { closingDr: number; closingCr: number } {
  return {
    closingDr: row.openingDr + row.debit,
    closingCr: row.openingCr + row.credit,
  };
}

/**
 * Compute roll-up values for parent rows:
 *   parent.openingDr = own.openingDr + SUM(children.openingDr)
 *   parent.openingCr = own.openingCr + SUM(children.openingCr)
 *   parent.debit     = own.debit     + SUM(children.debit)
 *   parent.credit    = own.credit    + SUM(children.credit)
 * Then recomputes closing on every row.
 */
export function computeRollups(rows: TBLedgerRow[]): TBLedgerRow[] {
  const byId = new Map(rows.map((r) => [r.id, { ...r }]));
  const childrenOf = new Map<string, string[]>();

  // Build parent → child map using accountPath
  const pathToId = new Map<string, string>();
  rows.forEach((r) => pathToId.set(r.accountPath.join('|'), r.id));

  rows.forEach((r) => {
    if (r.accountPath.length <= 1) return;
    const parentPath = r.accountPath.slice(0, -1).join('|');
    const parentId = pathToId.get(parentPath);
    if (!parentId) return;
    const arr = childrenOf.get(parentId) ?? [];
    arr.push(r.id);
    childrenOf.set(parentId, arr);
  });

  // Post-order: compute roll-ups from leaves up
  function sumNode(id: string): void {
    const node = byId.get(id)!;
    const children = childrenOf.get(id) ?? [];
    if (children.length === 0) return;
    children.forEach(sumNode);
    children.forEach((cid) => {
      const child = byId.get(cid)!;
      node.openingDr += child.openingDr;
      node.openingCr += child.openingCr;
      node.debit += child.debit;
      node.credit += child.credit;
    });
  }

  rows.forEach((r) => {
    if (r.accountPath.length === 1) sumNode(r.id);
  });

  // Recompute closing on every row after roll-ups
  const result = Array.from(byId.values());
  result.forEach((r) => {
    const c = computeClosing(r);
    r.closingDr = c.closingDr;
    r.closingCr = c.closingCr;
  });
  return result;
}

/**
 * Compute trial balance totals by nature groups:
 *   Dr-nature = Assets + Expense
 *   Cr-nature = Liabilities + Owner's Equity + Income
 */
export function computeTotals(rows: TBLedgerRow[]): TBReport['totals'] {
  const topLevel = rows.filter((r) => r.level === 1);
  const drSides = topLevel.filter((r) => r.side === 'dr');
  const crSides = topLevel.filter((r) => r.side === 'cr');

  const sum = (arr: TBLedgerRow[], key: keyof TBLedgerRow) =>
    arr.reduce((s, r) => s + (r[key] as number), 0);

  return {
    openingDr: sum(drSides, 'openingDr'),
    openingCr: sum(crSides, 'openingCr'),
    debit: sum(drSides, 'debit'),
    credit: sum(crSides, 'credit'),
    closingDr: sum(drSides, 'closingDr'),
    closingCr: sum(crSides, 'closingCr'),
  };
}

/**
 * Check trial balance is balanced on all 3 dimensions.
 */
export function checkBalance(totals: TBReport['totals']): {
  isBalanced: TBReport['isBalanced'];
  differences: TBReport['differences'];
} {
  const diffOpening = totals.openingDr - totals.openingCr;
  const diffMovement = totals.debit - totals.credit;
  const diffClosing = totals.closingDr - totals.closingCr;

  const eq = (d: number) => Math.abs(d) < 0.01;

  return {
    isBalanced: {
      opening: eq(diffOpening),
      movement: eq(diffMovement),
      closing: eq(diffClosing),
    },
    differences: {
      opening: diffOpening,
      movement: diffMovement,
      closing: diffClosing,
    },
  };
}

/**
 * Format a value per Value show In + currency.
 * Inter font, tabular-nums for alignment only.
 */
export function formatTBValue(
  value: number,
  valueShowIn: ValueShowIn = 'N/A',
  currency: Currency = 'BDT'
): string {
  if (value === 0 || isNaN(value)) return '0';

  const cfg =
    VALUE_SHOW_IN_OPTIONS.find((o) => o.value === valueShowIn) ||
    VALUE_SHOW_IN_OPTIONS[0];
  const scaled = value / cfg.divisor;

  if (valueShowIn === 'Percent') return `${scaled.toFixed(2)}%`;
  if (valueShowIn === 'Ratio') return scaled.toFixed(2);

  const sym = CURRENCY_SYMBOLS[currency] ?? currency;
  const fractionDigits = cfg.divisor > 1 ? 2 : 0;

  const fmt = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return `${sym} ${fmt.format(scaled)}`;
}

