import { BSTreeRow, ValueShowIn } from '../types/balanceSheet';

/**
 * Generate year columns from base date + N years.
 * Returns array of ISO dates, ordered NEWEST → OLDEST.
 */
export function generateYears(asOn: string, numberOfYears: number): string[] {
  if (!asOn) asOn = new Date().toISOString().slice(0, 10);
  const [yStr, mStr, dStr] = asOn.split('-');
  const y = parseInt(yStr, 10) || new Date().getFullYear();
  const m = parseInt(mStr, 10) || 1;
  const d = parseInt(dStr, 10) || 1;

  const years: string[] = [];
  const safeCount = Math.max(0, Math.min(numberOfYears, 10));

  for (let i = 0; i <= safeCount; i++) {
    const targetYear = y - i;
    // Format YYYY-MM-DD safely without timezone shifts
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    years.push(`${targetYear}-${mm}-${dd}`);
  }
  return years;
}

/**
 * Ensures an array of values has length equal to targetColCount.
 * If targetColCount > values.length, extrapolated based on historic trend.
 * If targetColCount < values.length, truncated.
 */
export function fitValues(values: number[], targetColCount: number): number[] {
  if (values.length === targetColCount) return [...values];
  if (values.length > targetColCount) return values.slice(0, targetColCount);

  const res = [...values];
  const lastVal = res[res.length - 1] ?? 0;
  const prevVal = res[res.length - 2] ?? lastVal;
  const ratio = prevVal !== 0 ? lastVal / prevVal : 1;

  while (res.length < targetColCount) {
    const curLast = res[res.length - 1] ?? 0;
    // apply slight historical trend or keep stable
    const nextVal = Math.round(curLast * (ratio > 0.5 && ratio < 1.5 ? ratio : 0.95));
    res.push(nextVal);
  }
  return res;
}

/**
 * Compute rolled-up values for parent rows.
 * Parent row.values = sum of children values per column.
 */
export function computeRollups(rows: BSTreeRow[], colCount: number = 4): BSTreeRow[] {
  const byId = new Map<string, BSTreeRow>();
  rows.forEach((r) => {
    byId.set(r.id, {
      ...r,
      values: fitValues(r.values, colCount),
    });
  });

  const childrenOf = new Map<string, BSTreeRow[]>();
  rows.forEach((r) => {
    if (!r.parentId) return;
    const list = childrenOf.get(r.parentId) ?? [];
    const item = byId.get(r.id);
    if (item) list.push(item);
    childrenOf.set(r.parentId, list);
  });

  // Post-order traversal
  function sumNode(id: string): number[] {
    const node = byId.get(id);
    if (!node) return Array(colCount).fill(0);
    const children = childrenOf.get(id) ?? [];
    if (children.length === 0) {
      return node.values;
    }
    const totals = Array(colCount).fill(0);
    children.forEach((c) => {
      const childVals = sumNode(c.id);
      childVals.forEach((v, i) => {
        totals[i] = (totals[i] || 0) + (v || 0);
      });
    });
    node.values = totals;
    return totals;
  }

  // 1. Roll up Current Assets and Non-Current Assets
  if (byId.has('a-ca')) sumNode('a-ca');
  if (byId.has('a-nca')) sumNode('a-nca');

  // Special Assets Totals: Total Assets = Current Assets + Non-Current Assets
  const ca = byId.get('a-ca')?.values ?? Array(colCount).fill(0);
  const nca = byId.get('a-nca')?.values ?? Array(colCount).fill(0);
  const totalAssets = ca.map((v, i) => v + (nca[i] || 0));

  if (byId.has('a')) {
    byId.get('a')!.values = [...totalAssets];
  }
  if (byId.has('a-total')) {
    byId.get('a-total')!.values = [...totalAssets];
  }

  // 2. Roll up Liabilities
  if (byId.has('le-liab-cl')) sumNode('le-liab-cl');
  if (byId.has('le-liab-ltl')) sumNode('le-liab-ltl');

  const cl = byId.get('le-liab-cl')?.values ?? Array(colCount).fill(0);
  const ltl = byId.get('le-liab-ltl')?.values ?? Array(colCount).fill(0);
  const totalLiab = cl.map((v, i) => v + (ltl[i] || 0));

  if (byId.has('le-liab')) {
    byId.get('le-liab')!.values = [...totalLiab];
  }
  if (byId.has('le-total-liab')) {
    byId.get('le-total-liab')!.values = [...totalLiab];
  }

  // 3. Roll up Owner's Equity
  if (byId.has('le-eq')) {
    sumNode('le-eq');
  }
  const eq = byId.get('le-eq')?.values ?? Array(colCount).fill(0);
  if (byId.has('le-total-eq')) {
    byId.get('le-total-eq')!.values = [...eq];
  }

  // 4. Grand Total = Total Liabilities + Total Owner's Equity
  const grandTotal = totalLiab.map((v, i) => v + (eq[i] || 0));
  if (byId.has('le-grand')) {
    byId.get('le-grand')!.values = [...grandTotal];
  }
  if (byId.has('le')) {
    byId.get('le')!.values = [...grandTotal];
  }

  return rows.map((r) => byId.get(r.id)!);
}

/**
 * Format currency symbol
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
 * Format a value per currency, showInPercent, and valueShowIn display modes.
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

  // Mode 1: showInPercent toggle or valueShowIn === 'Percent'
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

  // Mode 2: valueShowIn === 'Ratio'
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

  // Mode 3: valueShowIn === 'Absolute' or natural 'N/A'
  const absVal = valueShowIn === 'Absolute' ? Math.abs(value) : value;
  const sym = currencySymbol(currency);
  const formattedNum = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(absVal));

  const text = `${absVal < 0 ? '-' : ''}${sym} ${formattedNum}`;

  return {
    text,
    isZero: false,
    isNegative: absVal < 0,
  };
}

